import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "./lib/session";
import { safeCompareStrings } from "./lib/rateLimit";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Redirect /register or legacy /login to dedicated /admin portal
  if (pathname === "/register" || pathname === "/login") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // 2. Cryptographic session verification (OWASP API2:2023)
  const sessionCookie =
    request.cookies.get(ADMIN_SESSION_COOKIE)?.value ||
    request.cookies.get("admin_session")?.value;

  const sessionVerification = await verifySessionToken(sessionCookie);
  const hasValidAdminSession = sessionVerification.valid;

  // 3. If authenticated admin visits /admin, redirect straight to /dashboard
  if (pathname === "/admin" && hasValidAdminSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 4. Strict Dashboard Route Protection (OWASP A01:2021 & API5:2023)
  // Demo mode parameter bypass removed to prevent PII data leakage
  if (pathname.startsWith("/dashboard")) {
    if (!hasValidAdminSession) {
      const adminLoginUrl = new URL("/admin", request.url);
      adminLoginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(adminLoginUrl);
    }
  }

  // 5. Protect GET /api/orders (Customer PII Protection)
  if (pathname === "/api/orders" && request.method === "GET") {
    const adminKey = request.headers.get("x-admin-key");
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const isServiceRoleKeyValid = safeCompareStrings(adminKey, serviceRoleKey);

    const isAuthorized = isServiceRoleKeyValid || hasValidAdminSession;

    if (!isAuthorized) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Endpoint pesanan hanya dapat diakses oleh staf pengelola toko terautentikasi.",
        },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/register",
    "/login",
    "/admin",
    "/dashboard/:path*",
    "/api/orders",
  ],
};
