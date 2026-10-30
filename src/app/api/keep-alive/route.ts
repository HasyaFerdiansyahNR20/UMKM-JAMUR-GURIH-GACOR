import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/db";
import { checkRateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    // Prevent abuse while allowing scheduled cron pings (max 6 requests per minute per IP)
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "cron";
    const rateCheck = checkRateLimit(`keep-alive:${clientIp}`, 6, 60_000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { ok: false, error: "Too many requests" },
        { status: 429 }
      );
    }

    // Lightweight query to keep Supabase PostgreSQL active (prevents 7-day free-tier auto-pause)
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("id")
      .limit(1);

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          status: "Database query warning",
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      ok: true,
      status: "Supabase database is active and awake",
      checkedRows: data?.length ?? 0,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        status: "Keep-alive check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
