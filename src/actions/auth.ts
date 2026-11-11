"use server";

import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/db";
import { createAdminSessionToken, ADMIN_SESSION_COOKIE } from "@/lib/session";
import { checkRateLimit, safeCompareStrings } from "@/lib/rateLimit";
import { requireOwnerSession } from "@/lib/serverAuth";
import {
  loadSystemConfig,
  saveSystemConfig,
  generateOtpChallenge,
  verifyOtpChallenge,
  StaffAccount,
} from "@/lib/accountStore";
import { sendOtpEmailViaSmtp } from "@/lib/emailMailer";

function maskEmail(email: string): string {
  const [local, domain] = (email || "").split("@");
  if (!local || !domain) return email;
  const visible = local.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(2, local.length - 2))}@${domain}`;
}

/**
 * Step 1 of Login: Validate Email/Username + Password and send 6-digit OTP via SMTP Email
 * - If Owner logs in: OTP sent to Owner email
 * - If Karyawan (Admin) logs in: OTP sent to BOTH Karyawan email AND Owner email
 */
export async function loginAdminAction(formData: {
  email: string;
  password: string;
}): Promise<{
  success: boolean;
  requiresOtp?: boolean;
  challengeKey?: string;
  maskedEmail?: string;
  role?: "owner" | "admin";
  emailSent?: boolean;
  smtpError?: string;
  smtpEmailCurrent?: string;
  error?: string;
}> {
  try {
    const identifier = (formData.email || "").trim().toLowerCase();
    const trimmedPass = (formData.password || "").trim();

    if (!identifier || !trimmedPass) {
      return { success: false, error: "Email/Username dan kata sandi wajib diisi." };
    }

    // Brute-force protection (OWASP A07:2021) - max 12 attempts per minute
    const headerStore = await headers();
    const clientIp =
      headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headerStore.get("x-real-ip") ||
      "local";
    const rateCheck = checkRateLimit(`login:${clientIp}:${identifier}`, 12, 60_000);
    if (!rateCheck.allowed) {
      return {
        success: false,
        error: `Terlalu banyak percobaan login. Silakan tunggu ${rateCheck.retryAfterSeconds} detik lagi.`,
      };
    }

    const config = await loadSystemConfig();

    let matchedRole: "owner" | "admin" | null = null;
    let matchedEmail = "";
    let matchedUsername = "";

    // 1. Check Owner Account (by Email, Username, Primary Recovery Email, Secondary Recovery Email, or legacy admin@gurihgacor.com)
    const ownerIdentifiers = [
      config.owner.email.toLowerCase(),
      config.owner.username.toLowerCase(),
      config.owner.recoveryEmailPrimary.toLowerCase(),
      config.owner.recoveryEmailSecondary.toLowerCase(),
      (config.owner.smtpEmail || "").toLowerCase(),
      "admin@gurihgacor.com",
    ].filter(Boolean);

    if (ownerIdentifiers.includes(identifier)) {
      if (safeCompareStrings(trimmedPass, config.owner.password)) {
        matchedRole = "owner";
        matchedEmail = config.owner.email;
        matchedUsername = config.owner.username || "owner";
      } else {
        // Fallback check against Supabase Auth if owner email matches
        try {
          const { data, error } = await supabaseAdmin.auth.signInWithPassword({
            email: identifier.includes("@") ? identifier : config.owner.email,
            password: trimmedPass,
          });
          if (!error && data?.session) {
            matchedRole = "owner";
            matchedEmail = config.owner.email;
            matchedUsername = config.owner.username || "owner";
          }
        } catch {
          // Ignore Supabase auth fallback error
        }
      }
    }

    // 2. Check Staff/Admin (Karyawan) Accounts (by Email or Username)
    if (!matchedRole) {
      const foundAdmin = config.admins.find(
        (a) =>
          a.email.toLowerCase() === identifier ||
          a.username.toLowerCase() === identifier
      );
      if (foundAdmin && safeCompareStrings(trimmedPass, foundAdmin.password)) {
        matchedRole = "admin";
        matchedEmail = foundAdmin.email;
        matchedUsername = foundAdmin.username;
      }
    }

    if (!matchedRole) {
      return {
        success: false,
        error: "Email/Username atau kata sandi salah (atau akun karyawan sudah dihapus/resign).",
      };
    }

    // 3. Generate 6-digit OTP Challenge for Step 2 verification
    const challengeKey = `login:${matchedRole}:${matchedEmail.toLowerCase()}`;
    const otpCode = await generateOtpChallenge({
      key: challengeKey,
      email: matchedEmail,
      username: matchedUsername,
      role: matchedRole,
      purpose: "login",
    });

    // 4. Determine OTP Email Recipients:
    // - If Karyawan ("admin"): send to Karyawan's email AND Owner's main recipient email (config.owner.email)
    // - If Owner ("owner"): send to Owner's main recipient email (config.owner.email)
    const ownerRealEmail = !config.owner.email.toLowerCase().endsWith("@gurihgacor.com")
      ? config.owner.email
      : config.owner.recoveryEmailPrimary || config.owner.smtpEmail || config.owner.email;

    const rawRecipients =
      matchedRole === "admin"
        ? [matchedEmail, ownerRealEmail]
        : [ownerRealEmail];

    const otpRecipients = rawRecipients.filter(
      (r) => r && !r.toLowerCase().endsWith("@gurihgacor.com")
    );

    const smtpRes = await sendOtpEmailViaSmtp({
      recipients: otpRecipients.length > 0 ? otpRecipients : rawRecipients,
      otpCode,
      username: matchedUsername,
      role: matchedRole,
      purpose: "login",
    });

    const maskedDisplay =
      matchedRole === "admin"
        ? `${maskEmail(matchedEmail)} (Karyawan) & ${maskEmail(ownerRealEmail)} (Owner)`
        : maskEmail(ownerRealEmail);

    return {
      success: true,
      requiresOtp: true,
      challengeKey,
      maskedEmail: maskedDisplay,
      role: matchedRole,
      emailSent: smtpRes.sent,
      smtpError: smtpRes.error,
      smtpEmailCurrent: config.owner.smtpEmail || config.owner.email,
    };
  } catch (err: any) {
    console.error("Login action error:", err);
    return { success: false, error: "Terjadi kesalahan server saat proses masuk." };
  }
}

/**
 * Step 2 of Login: Verify 6-digit OTP Code and set signed Session Cookie with Role ("owner" | "admin")
 */
export async function verifyLoginOtpAction(params: {
  challengeKey: string;
  otpCode: string;
}): Promise<{ success: boolean; role?: "owner" | "admin"; error?: string }> {
  try {
    const headerStore = await headers();
    const clientIp =
      headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headerStore.get("x-real-ip") ||
      "local";
    const rateCheck = checkRateLimit(`verify-otp:${clientIp}`, 10, 60_000);
    if (!rateCheck.allowed) {
      return {
        success: false,
        error: `Terlalu banyak percobaan OTP. Silakan tunggu ${rateCheck.retryAfterSeconds} detik.`,
      };
    }

    const verification = await verifyOtpChallenge(
      params.challengeKey || "",
      params.otpCode || "",
      "login"
    );

    if (!verification.valid || !verification.record) {
      return {
        success: false,
        error: verification.error || "Kode OTP tidak valid.",
      };
    }

    const { email, username, role } = verification.record;
    const sessionToken = await createAdminSessionToken(email, role, username);
    const cookieStore = await cookies();

    cookieStore.set(ADMIN_SESSION_COOKIE, sessionToken, {
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
      sameSite: "lax",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    cookieStore.set("admin_session", sessionToken, {
      path: "/",
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return { success: true, role };
  } catch (err: any) {
    console.error("Verify OTP error:", err);
    return { success: false, error: "Terjadi kesalahan saat memverifikasi OTP." };
  }
}

/**
 * Account Recovery (Forgot Password): Get masked hints for Primary & Secondary Recovery Emails
 */
export async function getRecoveryEmailsHintAction(): Promise<{
  primaryMask: string;
  secondaryMask: string;
}> {
  const config = await loadSystemConfig();
  return {
    primaryMask: maskEmail(config.owner.recoveryEmailPrimary),
    secondaryMask: maskEmail(config.owner.recoveryEmailSecondary),
  };
}

/**
 * Account Recovery Step 1: Request OTP directly to selected Primary or Secondary Recovery Email
 */
export async function requestPasswordRecoveryOtpAction(params: {
  emailType: "primary" | "secondary";
}): Promise<{
  success: boolean;
  challengeKey?: string;
  emailSent?: boolean;
  smtpError?: string;
  error?: string;
}> {
  const headerStore = await headers();
  const clientIp =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip") ||
    "local";
  const rateCheck = checkRateLimit(`recovery-req:${clientIp}`, 6, 60_000);
  if (!rateCheck.allowed) {
    return {
      success: false,
      error: `Terlalu banyak permintaan pemulihan password. Silakan tunggu ${rateCheck.retryAfterSeconds} detik.`,
    };
  }

  const config = await loadSystemConfig();
  const targetEmail =
    params.emailType === "primary"
      ? config.owner.recoveryEmailPrimary.trim().toLowerCase()
      : config.owner.recoveryEmailSecondary.trim().toLowerCase();

  if (!targetEmail) {
    return {
      success: false,
      error: `${
        params.emailType === "primary" ? "Email Utama" : "Email Alternatif"
      } belum diatur di Dashboard Owner.`,
    };
  }

  const challengeKey = `recovery:${targetEmail}`;
  const otpCode = await generateOtpChallenge({
    key: challengeKey,
    email: targetEmail,
    username: config.owner.username,
    role: "owner",
    purpose: "recovery",
  });

  const smtpRes = await sendOtpEmailViaSmtp({
    recipients: [targetEmail],
    otpCode,
    username: config.owner.username,
    role: "owner",
    purpose: "recovery",
  });

  if (!smtpRes.sent) {
    return {
      success: false,
      error:
        smtpRes.error ||
        "Gagal mengirim email OTP pemulihan. Pastikan 16-digit Google App Password sudah benar.",
    };
  }

  return {
    success: true,
    challengeKey,
    emailSent: smtpRes.sent,
  };
}

/**
 * Account Recovery Step 2A: Verify Recovery OTP first before allowing new password input
 */
export async function verifyRecoveryOtpAction(params: {
  challengeKey: string;
  otpCode: string;
}): Promise<{ success: boolean; error?: string }> {
  const verification = await verifyOtpChallenge(
    params.challengeKey || "",
    params.otpCode || "",
    "recovery",
    false // Do not delete yet; will be consumed when saving new password in Step 2B
  );

  if (!verification.valid) {
    return {
      success: false,
      error: verification.error || "Kode OTP pemulihan tidak valid.",
    };
  }

  return { success: true };
}

/**
 * Account Recovery Step 2B: Verify Recovery OTP and update Owner Password
 */
export async function resetPasswordWithOtpAction(params: {
  challengeKey: string;
  otpCode: string;
  newPassword: string;
}): Promise<{ success: boolean; error?: string }> {
  const cleanPass = (params.newPassword || "").trim();
  if (cleanPass.length < 6) {
    return {
      success: false,
      error: "Kata sandi baru minimal harus 6 karakter.",
    };
  }

  const verification = await verifyOtpChallenge(
    params.challengeKey || "",
    params.otpCode || "",
    "recovery"
  );

  if (!verification.valid) {
    return {
      success: false,
      error: verification.error || "Kode OTP pemulihan tidak valid.",
    };
  }

  const config = await loadSystemConfig();
  config.owner.password = cleanPass;
  await saveSystemConfig(config);

  return { success: true };
}

/**
 * Owner Security & Admin Account Management Actions (Owner Only)
 */
export async function updateOwnerSecurityAction(params: {
  email: string;
  username: string;
  newPassword?: string;
  recoveryEmailPrimary: string;
  recoveryEmailSecondary: string;
  smtpEmail?: string;
  smtpAppPassword?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    await requireOwnerSession();
    const config = await loadSystemConfig();

    if (params.email?.trim()) config.owner.email = params.email.trim().toLowerCase();
    if (params.username?.trim()) config.owner.username = params.username.trim();
    if (params.newPassword && params.newPassword.trim().length >= 6) {
      config.owner.password = params.newPassword.trim();
    }
    if (params.recoveryEmailPrimary?.trim()) {
      config.owner.recoveryEmailPrimary = params.recoveryEmailPrimary.trim().toLowerCase();
    }
    if (params.recoveryEmailSecondary?.trim()) {
      config.owner.recoveryEmailSecondary = params.recoveryEmailSecondary.trim().toLowerCase();
    }
    if (params.smtpEmail !== undefined) {
      config.owner.smtpEmail = params.smtpEmail.trim().toLowerCase();
    }
    if (params.smtpAppPassword !== undefined) {
      config.owner.smtpAppPassword = params.smtpAppPassword.replace(/\s+/g, "").trim();
    }

    await saveSystemConfig(config);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal memperbarui keamanan akun Owner." };
  }
}

export async function createAdminAccountAction(params: {
  email: string;
  username: string;
  password: string;
}): Promise<{ success: boolean; account?: StaffAccount; error?: string }> {
  try {
    await requireOwnerSession();
    const cleanEmail = (params.email || "").trim().toLowerCase();
    const cleanUsername = (params.username || "").trim();
    const cleanPassword = (params.password || "").trim();

    if (!cleanEmail || !cleanUsername || cleanPassword.length < 4) {
      return {
        success: false,
        error: "Email penerima OTP, Username, dan Password (minimal 4 karakter) wajib diisi.",
      };
    }

    const config = await loadSystemConfig();

    const exists = config.admins.some(
      (a) =>
        a.email.toLowerCase() === cleanEmail ||
        a.username.toLowerCase() === cleanUsername.toLowerCase()
    );
    if (exists) {
      return {
        success: false,
        error: "Email atau Username sudah digunakan oleh akun karyawan lain.",
      };
    }

    const newAccount: StaffAccount = {
      id: `admin-${Date.now()}`,
      email: cleanEmail,
      username: cleanUsername,
      password: cleanPassword,
      role: "admin",
      createdAt: new Date().toISOString(),
    };

    config.admins = [newAccount, ...config.admins];
    await saveSystemConfig(config);
    revalidatePath("/dashboard");
    return { success: true, account: newAccount };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal membuat akun Admin/Karyawan." };
  }
}

export async function updateAdminAccountAction(params: {
  id: string;
  email: string;
  username: string;
  password?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    await requireOwnerSession();
    const config = await loadSystemConfig();
    const idx = config.admins.findIndex((a) => a.id === params.id);
    if (idx === -1) {
      return { success: false, error: "Akun Admin tidak ditemukan." };
    }

    if (params.email?.trim()) config.admins[idx].email = params.email.trim().toLowerCase();
    if (params.username?.trim()) config.admins[idx].username = params.username.trim();
    if (params.password && params.password.trim().length >= 4) {
      config.admins[idx].password = params.password.trim();
    }

    await saveSystemConfig(config);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal memperbarui akun Admin." };
  }
}

export async function deleteAdminAccountAction(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await requireOwnerSession();
    const config = await loadSystemConfig();
    config.admins = config.admins.filter((a) => a.id !== id);
    await saveSystemConfig(config);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal menghapus akun Admin." };
  }
}

export async function testSmtpEmailAction(params: {
  smtpEmail: string;
  smtpAppPassword: string;
  testRecipient: string;
}): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    await requireOwnerSession();
    const config = await loadSystemConfig();
    config.owner.smtpEmail = (params.smtpEmail || "").trim().toLowerCase();
    config.owner.smtpAppPassword = (params.smtpAppPassword || "").replace(/\s+/g, "").trim();
    await saveSystemConfig(config);

    const recipient = (params.testRecipient || config.owner.recoveryEmailPrimary || config.owner.smtpEmail).trim();
    const res = await sendOtpEmailViaSmtp({
      recipients: [recipient],
      otpCode: "888999",
      username: "Tes Koneksi SMTP",
      role: "owner",
      purpose: "login",
    });

    if (!res.sent) {
      return {
        success: false,
        error: res.error || "Gagal mengirim email tes.",
      };
    }

    return {
      success: true,
      message: `Berhasil! Email tes OTP (888999) telah terkirim ke ${recipient}. Silakan cek Inbox/Spam.`,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Gagal menguji koneksi SMTP.",
    };
  }
}

export async function logoutAdminAction(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_SESSION_COOKIE);
    cookieStore.delete("admin_session");
    cookieStore.delete("sb-access-token");
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}
