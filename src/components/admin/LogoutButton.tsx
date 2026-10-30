"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { logoutAdminAction } from "@/actions/auth";
import { supabase } from "@/db";

export function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (!confirm("Apakah Anda yakin ingin keluar dari panel pengelola?")) return;
    setIsLoggingOut(true);
    try {
      // 1. Clear server-side session cookies
      await logoutAdminAction();

      // 2. Clear client-side Supabase session & cookies
      await supabase.auth.signOut();
      document.cookie = "admin_session=; path=/; max-age=0; SameSite=Lax";
      document.cookie = "sb-access-token=; path=/; max-age=0; SameSite=Lax";

      // 3. Redirect to dedicated admin login page
      router.push("/admin?logged_out=true");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
      window.location.href = "/admin?logged_out=true";
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-red-600/90 hover:bg-red-600 text-white transition-all shadow-sm active:scale-95"
      title="Keluar dari Panel Admin"
    >
      <LogOut className="w-3.5 h-3.5" />
      <span>{isLoggingOut ? "Keluar..." : "Logout"}</span>
    </button>
  );
}
