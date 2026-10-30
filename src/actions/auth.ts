"use server";

import { cookies } from "next/headers";
import { supabaseAdmin } from "@/db";
import { createAdminSessionToken, ADMIN_SESSION_COOKIE } from "@/lib/session";

export async function loginAdminAction(formData: {
  email: string;
  password: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const trimmedEmail = (formData.email || "").trim().toLowerCase();
    const trimmedPass = (formData.password || "").trim();

    if (!trimmedEmail || !trimmedPass) {
      return { success: false, error: "Email dan kata sandi wajib diisi." };
    }

    let isAuthorized = false;

    // 1. First, attempt official Supabase Auth verification
    try {
      const { data, error } = await supabaseAdmin.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPass,
      });

      if (!error && data?.session) {
        isAuthorized = true;
      }
    } catch (sbErr) {
      // Supabase auth attempt failed or offline
    }

    // 2. Fallback to securely configured environment administrator credentials
    if (!isAuthorized) {
      const configuredEmails = (
        process.env.ADMIN_EMAILS || "admin@gurihgacor.com,fnrhasya@gmail.com"
      )
        .split(",")
        .map((e) => e.trim().toLowerCase());
      
      const configuredPassword = process.env.ADMIN_PASSWORD;

      if (
        configuredPassword &&
        configuredEmails.includes(trimmedEmail) &&
        trimmedPass === configuredPassword
      ) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return {
        success: false,
        error: "Email atau kata sandi pengelola salah. Akses dibatasi khusus pemilik UMKM Gurih Gacor.",
      };
    }

    // 3. Issue cryptographically signed tamper-proof session token (OWASP API2:2023)
    const sessionToken = await createAdminSessionToken(trimmedEmail, "owner");
    const cookieStore = await cookies();

    // Set signed session cookie
    cookieStore.set(ADMIN_SESSION_COOKIE, sessionToken, {
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
      sameSite: "lax",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    // Also set legacy cookie for backwards compatibility during rolling transitions
    cookieStore.set("admin_session", sessionToken, {
      path: "/",
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return { success: true };
  } catch (err: any) {
    console.error("Login action error:", err);
    return { success: false, error: "Terjadi kesalahan server saat proses masuk." };
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
