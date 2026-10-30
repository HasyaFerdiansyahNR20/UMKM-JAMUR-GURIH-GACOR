"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Flame, Lock, Mail, ArrowRight, ShieldAlert, ArrowLeft, CheckCircle2 } from "lucide-react";
import { loginAdminAction } from "@/actions/auth";
import { supabase } from "@/db";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isLoggedOut = searchParams.get("logged_out") === "true";
  const redirectTarget = searchParams.get("from") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      // 1. Verifikasi kredensial server-side dan pasang session cookie
      const res = await loginAdminAction({ email, password });

      if (!res.success) {
        setErrorMsg(res.error || "Email atau kata sandi pengelola salah.");
        setIsLoading(false);
        return;
      }

      // 2. Autentikasi client-side Supabase jika tersedia
      try {
        await supabase.auth.signInWithPassword({ email, password });
      } catch (authErr) {
        // Abaikan jika Supabase auth client adalah fallback
      }

      // 3. Masuk langsung ke Dasbor Admin
      router.push(redirectTarget);
      router.refresh();
    } catch (err: any) {
      console.error("Admin login error:", err);
      setErrorMsg("Terjadi kesalahan saat masuk. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/90 shadow-2xl">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white mx-auto shadow-lg shadow-amber-500/25 mb-4">
          <Flame className="w-9 h-9 fill-amber-200 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          Login Pemilik &amp; Admin
        </h1>
        <p className="text-xs text-stone-500 mt-1.5 font-medium">
          Portal Khusus Pengelola UMKM Gurih Gacor
        </p>
      </div>

      {/* Logout Success Banner */}
      {isLoggedOut && (
        <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Anda telah berhasil keluar dari akun pengelola toko.</span>
        </div>
      )}

      {/* Security Notice for Public Users */}
      <div className="mb-6 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Perhatian:</strong> Halaman ini khusus pemilik dan pengelola toko. Pembeli <u>tidak perlu login</u> untuk memesan makanan (pesanan diproses langsung via WhatsApp).
        </p>
      </div>

      {errorMsg && (
        <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
          {errorMsg}
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
            EMAIL PENGELOLA / ADMIN
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gurihgacor.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all placeholder:text-stone-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
            KATA SANDI
          </label>
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
          className="w-full py-3.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 mt-2"
        >
          <span>{isLoading ? "Memverifikasi..." : "MASUK KE PANEL PENGELOLA"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

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
