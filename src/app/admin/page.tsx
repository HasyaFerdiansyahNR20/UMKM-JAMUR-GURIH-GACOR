"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Flame,
  Lock,
  Mail,
  ArrowRight,
  ShieldAlert,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import {
  loginAdminAction,
  verifyLoginOtpAction,
  getRecoveryEmailsHintAction,
  requestPasswordRecoveryOtpAction,
  verifyRecoveryOtpAction,
  resetPasswordWithOtpAction,
} from "@/actions/auth";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isLoggedOut = searchParams.get("logged_out") === "true";
  const rawFrom = searchParams.get("from") || "/dashboard";
  const redirectTarget =
    rawFrom.startsWith("/") && !rawFrom.startsWith("//") && !rawFrom.startsWith("/\\")
      ? rawFrom
      : "/dashboard";

  // Mode: "login" | "otp" | "recovery_step1" | "recovery_otp" | "recovery_password"
  const [viewMode, setViewMode] = useState<
    "login" | "otp" | "recovery_step1" | "recovery_otp" | "recovery_password"
  >("login");

  // Login states
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [challengeKey, setChallengeKey] = useState("");
  const [maskedTargetEmail, setMaskedTargetEmail] = useState("");
  const [detectedRole, setDetectedRole] = useState<"owner" | "admin">("owner");
  const [otpCode, setOtpCode] = useState("");
  const [emailSentStatus, setEmailSentStatus] = useState<boolean>(false);
  const [smtpErrorDetail, setSmtpErrorDetail] = useState<string>("");

  // Recovery states (2 Emails: Primary & Secondary)
  const [recoveryHints, setRecoveryHints] = useState<{ primaryMask: string; secondaryMask: string }>({
    primaryMask: "ku***@gmail.com",
    secondaryMask: "fn***@gmail.com",
  });
  const [selectedRecoveryType, setSelectedRecoveryType] = useState<"primary" | "secondary">("primary");
  const [recoveryChallengeKey, setRecoveryChallengeKey] = useState("");
  const [recoveryOtpCode, setRecoveryOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Feedback states
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getRecoveryEmailsHintAction()
      .then((res) => setRecoveryHints(res))
      .catch(() => {});
  }, []);

  // STEP 1: Verify Email/Username + Password -> Request OTP via Email
  const handleLoginStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      const res = await loginAdminAction({ email: identifier, password });
      if (!res.success) {
        setErrorMsg(res.error || "Email/Username atau kata sandi salah.");
        setIsLoading(false);
        return;
      }

      if (res.requiresOtp && res.challengeKey) {
        setChallengeKey(res.challengeKey);
        setMaskedTargetEmail(res.maskedEmail || identifier);
        setDetectedRole(res.role || "admin");
        setEmailSentStatus(Boolean(res.emailSent));
        setSmtpErrorDetail(res.smtpError || "");
        setOtpCode("");
        setViewMode("otp");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan saat masuk. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: Verify 6-Digit OTP -> Redirect to Dashboard
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const res = await verifyLoginOtpAction({ challengeKey, otpCode });
      if (!res.success) {
        setErrorMsg(res.error || "Kode OTP salah atau kadaluarsa.");
        setIsLoading(false);
        return;
      }

      router.push(redirectTarget);
      router.refresh();
    } catch (err) {
      setErrorMsg("Gagal memverifikasi kode OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  // RECOVERY STEP 1: Request OTP directly to Primary or Secondary Recovery Email
  const handleRecoveryStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      const res = await requestPasswordRecoveryOtpAction({
        emailType: selectedRecoveryType,
      });

      if (!res.success || !res.challengeKey) {
        setErrorMsg(res.error || "Gagal mengirim kode pemulihan.");
        setIsLoading(false);
        return;
      }

      setRecoveryChallengeKey(res.challengeKey);
      setRecoveryOtpCode("");
      setNewPassword("");
      setConfirmNewPassword("");
      setViewMode("recovery_otp");
    } catch (err) {
      setErrorMsg("Gagal mengirim kode pemulihan.");
    } finally {
      setIsLoading(false);
    }
  };

  // RECOVERY STEP 2: Verify 6-Digit OTP Only -> Proceed to New Password Screen
  const handleRecoveryVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      const res = await verifyRecoveryOtpAction({
        challengeKey: recoveryChallengeKey,
        otpCode: recoveryOtpCode,
      });

      if (!res.success) {
        setErrorMsg(res.error || "Kode OTP pemulihan salah atau kadaluarsa.");
        setIsLoading(false);
        return;
      }

      setViewMode("recovery_password");
    } catch {
      setErrorMsg("Gagal memverifikasi kode OTP pemulihan.");
    } finally {
      setIsLoading(false);
    }
  };

  // RECOVERY STEP 3: Save New Password (after OTP verified)
  const handleRecoveryStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (newPassword !== confirmNewPassword) {
      setErrorMsg("Konfirmasi kata sandi baru tidak cocok.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetPasswordWithOtpAction({
        challengeKey: recoveryChallengeKey,
        otpCode: recoveryOtpCode,
        newPassword,
      });

      if (!res.success) {
        setErrorMsg(res.error || "Gagal mengatur ulang kata sandi.");
        setIsLoading(false);
        return;
      }

      setSuccessMsg("Kata sandi berhasil diperbarui! Silakan login dengan kata sandi baru Anda.");
      setPassword("");
      setViewMode("login");
    } catch (err) {
      setErrorMsg("Terjadi kesalahan saat menyimpan kata sandi baru.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/90 shadow-2xl">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white mx-auto shadow-lg shadow-amber-500/25 mb-4">
          <Flame className="w-9 h-9 fill-amber-200 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          {viewMode === "login" && "Login Owner & Admin"}
          {viewMode === "otp" && "Verifikasi Kode OTP"}
          {viewMode === "recovery_step1" && "Pemulihan Akun"}
          {viewMode === "recovery_otp" && "Verifikasi OTP Pemulihan"}
          {viewMode === "recovery_password" && "Buat Kata Sandi Baru"}
        </h1>
        <p className="text-xs text-stone-500 mt-1.5 font-medium">
          Portal Khusus Pengelola UMKM Gurih Gacor
        </p>
      </div>

      {/* Logout Success Banner */}
      {isLoggedOut && viewMode === "login" && (
        <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Anda telah berhasil keluar dari akun pengelola toko.</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2.5 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-semibold">
          {errorMsg}
        </div>
      )}

      {/* ========================================== */}
      {/* VIEW 1: LOGIN (EMAIL/USERNAME & PASSWORD)  */}
      {/* ========================================== */}
      {viewMode === "login" && (
        <>
          <div className="mb-5 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Info Role:</strong> Masuk sebagai <strong>Owner</strong> (akses penuh) atau <strong>Admin/Karyawan</strong> (khusus kelola Stok &amp; Pesanan) menggunakan Email atau Username.
            </p>
          </div>

          <form onSubmit={handleLoginStep1} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                EMAIL ATAU USERNAME
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Email atau username"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all placeholder:text-stone-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  KATA SANDI
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg("");
                    setSuccessMsg("");
                    setViewMode("recovery_step1");
                  }}
                  className="text-[11px] font-bold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer"
                >
                  Lupa Kata Sandi?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              <span>{isLoading ? "Memverifikasi..." : "LANJUTKAN (KIRIM OTP KE EMAIL)"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </>
      )}

      {/* ========================================== */}
      {/* VIEW 2: 6-DIGIT OTP VERIFICATION (EMAIL)   */}
      {/* ========================================== */}
      {viewMode === "otp" && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-700 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-900">Verifikasi Keamanan 2 Langkah</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  detectedRole === "owner"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-sky-100 text-sky-800"
                }`}
              >
                Role: {detectedRole.toUpperCase()}
              </span>
            </div>

            {emailSentStatus ? (
              <p className="text-[11px] text-emerald-700 font-semibold leading-relaxed">
                ✓ Kode OTP 6 digit telah dikirimkan via email ke{" "}
                <strong>{maskedTargetEmail}</strong>. Silakan cek kotak masuk (Inbox / Spam) email Anda.
              </p>
            ) : (
              <div className="pt-1">
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-[11px] text-red-700 font-semibold flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold block">Pengiriman Email OTP Gagal:</span>
                    <span>{smtpErrorDetail || "Silakan hubungi Owner toko untuk memeriksa konfigurasi email pengirim."}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              MASUKKAN KODE OTP DARI EMAIL (6 ANGKA)
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                required
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="Contoh: 482910"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 text-sm font-black tracking-[0.3em] text-center focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || otpCode.length < 6}
            className="w-full py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isLoading ? "Memverifikasi OTP..." : "VERIFIKASI & MASUK DASBOR"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setViewMode("login");
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className="w-full py-2 text-xs font-bold text-stone-500 hover:text-stone-800 cursor-pointer"
          >
            ← Kembali ke Halaman Login
          </button>
        </form>
      )}

      {/* ========================================== */}
      {/* VIEW 3: ACCOUNT RECOVERY STEP 1 (2 EMAILS) */}
      {/* ========================================== */}
      {viewMode === "recovery_step1" && (
        <form onSubmit={handleRecoveryStep1} className="space-y-4">
          <p className="text-xs text-stone-600 leading-relaxed">
            Pilih salah satu dari <strong>2 Email Pemulihan</strong> yang terdaftar untuk menerima kode OTP ganti kata sandi:
          </p>

          <div className="grid grid-cols-1 gap-2.5">
            <label
              onClick={() => setSelectedRecoveryType("primary")}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedRecoveryType === "primary"
                  ? "border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20"
                  : "border-stone-200 bg-stone-50 hover:bg-stone-100"
              }`}
            >
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 block">
                  Opsi 1 — Email Pemulihan Utama
                </span>
                <span className="text-xs font-bold text-stone-900">
                  {recoveryHints.primaryMask}
                </span>
              </div>
              <input
                type="radio"
                name="recoveryType"
                checked={selectedRecoveryType === "primary"}
                onChange={() => setSelectedRecoveryType("primary")}
                className="text-amber-600 focus:ring-amber-500"
              />
            </label>

            <label
              onClick={() => setSelectedRecoveryType("secondary")}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedRecoveryType === "secondary"
                  ? "border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20"
                  : "border-stone-200 bg-stone-50 hover:bg-stone-100"
              }`}
            >
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 block">
                  Opsi 2 — Email Pemulihan Alternatif
                </span>
                <span className="text-xs font-bold text-stone-900">
                  {recoveryHints.secondaryMask}
                </span>
              </div>
              <input
                type="radio"
                name="recoveryType"
                checked={selectedRecoveryType === "secondary"}
                onChange={() => setSelectedRecoveryType("secondary")}
                className="text-amber-600 focus:ring-amber-500"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{isLoading ? "Memproses..." : "KIRIM KODE PEMULIHAN KE EMAIL"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setViewMode("login");
              setErrorMsg("");
            }}
            className="w-full py-2 text-xs font-bold text-stone-500 hover:text-stone-800 cursor-pointer"
          >
            ← Batal &amp; Kembali ke Login
          </button>
        </form>
      )}

      {/* ========================================== */}
      {/* VIEW 4: ACCOUNT RECOVERY STEP 2 (OTP ONLY) */}
      {/* ========================================== */}
      {viewMode === "recovery_otp" && (
        <form onSubmit={handleRecoveryVerifyOtp} className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold leading-relaxed">
            ✓ Kode OTP pemulihan 6 digit telah dikirim ke email Anda. Masukkan kode OTP terlebih dahulu untuk membuka halaman ganti kata sandi.
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              KODE OTP PEMULIHAN DARI EMAIL (6 DIGIT)
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                required
                value={recoveryOtpCode}
                onChange={(e) => setRecoveryOtpCode(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="Masukkan 6 angka OTP"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 text-sm font-black tracking-[0.3em] text-center focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || recoveryOtpCode.length < 6}
            className="w-full py-3.5 rounded-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isLoading ? "Memverifikasi OTP..." : "VERIFIKASI KODE OTP"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setViewMode("recovery_step1");
              setErrorMsg("");
            }}
            className="w-full py-2 text-xs font-bold text-stone-500 hover:text-stone-800 cursor-pointer"
          >
            ← Pilih Ulang Email Pemulihan
          </button>
        </form>
      )}

      {/* ========================================== */}
      {/* VIEW 5: ACCOUNT RECOVERY STEP 3 (NEW PASS) */}
      {/* ========================================== */}
      {viewMode === "recovery_password" && (
        <form onSubmit={handleRecoveryStep2} className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Kode OTP terverifikasi! Silakan buat kata sandi baru Anda.</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              KATA SANDI BARU (MIN. 6 KARAKTER)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Masukkan kata sandi baru"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              KONFIRMASI KATA SANDI BARU
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Ketik ulang kata sandi baru"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isLoading ? "Menyimpan..." : "SIMPAN KATA SANDI BARU"}</span>
          </button>
        </form>
      )}

      {/* Return to website */}
      <div className="mt-8 pt-6 border-t border-stone-100 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 font-semibold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Halaman Katalog Menu</span>
        </Link>
      </div>
    </div>
  );
}

export default function AdminPortalPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#faf8f5]">
      <Suspense fallback={<div className="p-8 text-center text-xs text-stone-500">Memuat halaman login admin...</div>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
