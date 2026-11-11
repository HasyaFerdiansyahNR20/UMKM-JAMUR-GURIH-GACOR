import nodemailer from "nodemailer";
import { loadSystemConfig } from "./accountStore";

export interface SendOtpEmailParams {
  recipients: string[];
  otpCode: string;
  username: string;
  role: "owner" | "admin";
  purpose: "login" | "recovery";
}

function escapeHtml(unsafe: string): string {
  return String(unsafe || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendOtpEmailViaSmtp(
  params: SendOtpEmailParams
): Promise<{ sent: boolean; recipients: string[]; error?: string }> {
  const config = await loadSystemConfig();

  const smtpUser = (
    config.owner.smtpEmail ||
    process.env.SMTP_EMAIL ||
    ""
  ).trim();
  const smtpPass = (
    config.owner.smtpAppPassword ||
    process.env.SMTP_APP_PASSWORD ||
    ""
  )
    .replace(/\s+/g, "")
    .trim();

  // Deduplicate valid recipient emails
  const validRecipients = Array.from(
    new Set(
      params.recipients
        .map((r) => (r || "").trim().toLowerCase())
        .filter((r) => r.includes("@"))
    )
  );

  if (!smtpUser || !smtpPass) {
    return {
      sent: false,
      recipients: validRecipients,
      error: "SMTP Gmail belum diisi di Pengaturan Owner / Environment Variables.",
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // SSL
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const safeUsername = escapeHtml(params.username);
    const safeOtpCode = escapeHtml(params.otpCode);

    const subject =
      params.purpose === "recovery"
        ? `[UMKM Gurih Gacor] Kode OTP Pemulihan Password: ${safeOtpCode}`
        : `[UMKM Gurih Gacor] Kode OTP Login ${params.role.toUpperCase()} (${safeUsername}): ${safeOtpCode}`;

    const roleLabel =
      params.role === "owner" ? "OWNER (Pemilik Toko)" : `ADMIN / KARYAWAN (${safeUsername})`;

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border-radius: 16px; border: 1px solid #e7e5e4; background-color: #faf8f5;">
        <div style="text-align: center; margin-bottom: 18px;">
          <h2 style="margin: 0; color: #1c1917; font-size: 22px;">🍄 UMKM GURIH GACOR</h2>
          <p style="margin: 4px 0 0; color: #b45309; font-size: 12px; font-weight: bold;">
            Sistem Keamanan Portal Pengelola Toko
          </p>
        </div>

        <div style="background: #ffffff; border-radius: 14px; padding: 20px; border: 1px solid #f59e0b;">
          <p style="margin: 0 0 10px; color: #44403c; font-size: 13px;">
            ${
              params.purpose === "recovery"
                ? "Permintaan <strong>Pemulihan / Ganti Kata Sandi</strong> diterima."
                : `Permintaan <strong>Login Dasbor</strong> diterima untuk akun: <strong>${roleLabel}</strong>.`
            }
          </p>

          <p style="margin: 0 0 8px; color: #78716c; font-size: 12px;">
            Masukkan 6 angka Kode OTP berikut di halaman verifikasi (berlaku 5 menit):
          </p>

          <div style="text-align: center; margin: 16px 0; padding: 14px; background: #fef3c7; border-radius: 12px; border: 2px dashed #f59e0b;">
            <span style="font-size: 28px; font-weight: 900; letter-spacing: 8px; color: #1c1917;">
              ${safeOtpCode}
            </span>
          </div>

          <p style="margin: 12px 0 0; color: #78716c; font-size: 11px; line-height: 1.5;">
            *Jika ini adalah login karyawan, email ini dikirimkan sekaligus ke <strong>Email Karyawan</strong> dan <strong>Email Owner</strong> sebagai pemberitahuan keamanan akses.
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"UMKM Gurih Gacor Security" <${smtpUser}>`,
      to: validRecipients.join(", "),
      subject,
      html: htmlBody,
    });

    return { sent: true, recipients: validRecipients };
  } catch (err: any) {
    console.error("SMTP OTP Send Error:", err);
    const rawMsg = String(err?.message || "");
    const friendlyError =
      rawMsg.includes("535") || rawMsg.includes("BadCredentials")
        ? "Google menolak password biasa. Wajib menggunakan 16-digit 'Sandi Aplikasi (App Password)' dari myaccount.google.com/apppasswords (bukan password login Gmail biasa)."
        : rawMsg || "Gagal mengirim email via SMTP Gmail.";

    return {
      sent: false,
      recipients: validRecipients,
      error: friendlyError,
    };
  }
}
