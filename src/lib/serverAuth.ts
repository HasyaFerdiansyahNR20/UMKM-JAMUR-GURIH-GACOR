import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "./session";
import { supabaseAdmin } from "@/db";

export interface AuthCheckResult {
  isAuthenticated: boolean;
  email?: string;
  role?: string;
}

/**
 * Validates whether current request has an authenticated admin session.
 * Checks HMAC-signed session cookie and validates against Supabase Auth if present.
 */
export async function checkAdminAuth(): Promise<AuthCheckResult> {
  try {
    const cookieStore = await cookies();
    
    // 1. Check cryptographically signed admin session cookie
    const signedToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
    if (signedToken) {
      const verification = await verifySessionToken(signedToken);
      if (verification.valid && verification.payload) {
        return {
          isAuthenticated: true,
          email: verification.payload.email,
          role: verification.payload.role,
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
              role: "admin",
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
 * Server Action & Route Guard.
 * Throws an explicit error if the caller is not an authenticated store admin.
 */
export async function requireAdminSession(): Promise<AuthCheckResult> {
  const auth = await checkAdminAuth();
  if (!auth.isAuthenticated) {
    throw new Error("Unauthorized: Tindakan ini memerlukan otentikasi pengelola toko yang sah.");
  }
  return auth;
}
