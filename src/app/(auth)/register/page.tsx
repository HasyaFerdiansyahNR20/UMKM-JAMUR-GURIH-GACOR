import React from "react";
import Link from "next/link";
import { Flame, ShieldAlert, ArrowLeft, Lock } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#faf8f5]">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-stone-200 shadow-xl text-center">
        
        {/* Brand Header */}
        <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 mx-auto shadow-sm mb-4">
          <Lock className="w-8 h-8 text-amber-600" />
        </div>

        <h1 className="text-xl font-black text-stone-900 tracking-tight mb-2">
          Pendaftaran Pengelola Ditutup
        </h1>

        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-xs text-stone-700 leading-relaxed text-left mb-6 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Akses Khusus Terbatas</span>
          </div>
          <p>
            Untuk menjaga keamanan katalog harga dan stok makanan, pendaftaran akun staf secara mandiri/publik telah <strong>dinonaktifkan</strong>.
          </p>
          <p className="text-[11px] text-stone-500">
            Penambahan staf baru hanya dapat dilakukan secara internal oleh Pemilik Toko melalui panel otentikasi Supabase.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/login"
            className="w-full py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>Masuk sebagai Admin</span>
          </Link>

          <Link
            href="/"
            className="w-full py-2.5 rounded-full border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Katalog Menu Utama</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
