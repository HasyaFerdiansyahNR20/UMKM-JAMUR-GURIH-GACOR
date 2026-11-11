import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "./session";
import { supabaseAdmin } from "@/db";
import { loadSystemConfig } from "./accountStore";

export interface AuthCheckResult {
  isAuthenticated: boolean;
  email?: string;
  username?: string;
  role?: "owner" | "admin";
}

/**
 * Validates whether current request has an authenticated admin/owner session.
 * Also verifies that an "admin" (karyawan) account has NOT been deleted (resigned).
 */
export async function checkAdminAuth(): Promise<AuthCheckResult> {
  try {
    const cookieStore = await cookies();

    // 1. Check cryptographically signed admin/owner session cookie
    const signedToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
    if (signedToken) {
      const verification = await verifySessionToken(signedToken);
      if (verification.valid && verification.payload) {
        const role = verification.payload.role === "owner" ? "owner" : "admin";

        // If role is "admin" (karyawan), verify account still exists (not resigned/deleted)
        if (role === "admin") {
          const config = await loadSystemConfig();
          const stillActive = config.admins.some(
            (a) =>
              a.email.toLowerCase() === verification.payload!.email.toLowerCase() ||
              a.username.toLowerCase() ===
                (verification.payload!.username || "").toLowerCase()
          );
          if (!stillActive) {
            return { isAuthenticated: false };
          }
        }

        return {
          isAuthenticated: true,
          email: verification.payload.email,
          username:
            verification.payload.username ||
            verification.payload.email.split("@")[0],
          role,
        };
      }
    }

    // 2. Check Supabase access token if present and verify against ADMIN_EMAILS whitelist
    const sbToken = cookieStore.get("sb-access-token")?.value;
    if (sbToken && sbToken !== "logged_out" && sbToken.length > 20) {
      try {
        const { data, error } = await supabaseAdmin.auth.getUser(sbToken);
        const userEmail = data?.user?.email?.trim().toLowerCase();
        if (!error && userEmail) {
          const allowedAdminEmails = (
            process.env.ADMIN_EMAILS || "admin@gurihgacor.com,fnrhasya@gmail.com"
          )
            .split(",")
            .map((e) => e.trim().toLowerCase());

          if (allowedAdminEmails.includes(userEmail)) {
            return {
              isAuthenticated: true,
              email: userEmail,
              username: userEmail.split("@")[0],
              role: "owner",
            };
          }
        }
      } catch (sbErr) {
        // Continue to unauthenticated
      }
    }

    return { isAuthenticated: false };
  } catch (err) {
    return { isAuthenticated: false };
  }
}

/**
 * Server Action & Route Guard for Admin & Owner (Stock & Order Logs).
 */
export async function requireAdminSession(): Promise<AuthCheckResult> {
  const auth = await checkAdminAuth();
  if (!auth.isAuthenticated) {
    throw new Error("Unauthorized: Tindakan ini memerlukan otentikasi pengelola toko yang sah.");
  }
  return auth;
}

/**
 * Server Action & Route Guard exclusively for Owner (Products, Promos, Contact Settings, Account Management).
 */
export async function requireOwnerSession(): Promise<AuthCheckResult> {
  const auth = await checkAdminAuth();
  if (!auth.isAuthenticated || auth.role !== "owner") {
    throw new Error("Forbidden: Tindakan ini hanya dapat dilakukan oleh akun berstatus OWNER.");
  }
  return auth;
}
