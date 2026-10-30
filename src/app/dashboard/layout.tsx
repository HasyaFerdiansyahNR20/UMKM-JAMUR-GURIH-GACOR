import React from "react";
import Link from "next/link";
import { ArrowLeft, Flame } from "lucide-react";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Top Admin Sub-bar */}
      <div className="bg-stone-900 text-white border-b border-stone-800 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 px-3 py-1.5 rounded-full transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Website</span>
            </Link>
            <span className="text-stone-600">|</span>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
              Panel Manajemen UMKM Gurih Gacor
            </span>
          </div>

          <div className="flex items-center gap-3">
            <LogoutButton />
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
}
