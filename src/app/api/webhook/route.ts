import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/db";
import { getNextSequentialId } from "@/lib/idGenerator";
import crypto from "crypto";

function constantTimeCompare(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(request: Request) {
  try {
    // 1. Secret Token Verification (Fail-Closed, Anti-Timing Attack - OWASP API10:2023)
    const secretHeader =
      request.headers.get("x-webhook-secret") ||
      request.headers.get("x-api-key") ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    const expectedSecret = process.env.WEBHOOK_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!expectedSecret || !secretHeader || !constantTimeCompare(secretHeader, expectedSecret)) {
      console.warn("⚠️ [Security Alert]: Unauthorized webhook attempt detected.");
      return NextResponse.json(
        { received: false, error: "Unauthorized: Invalid or missing webhook credentials." },
        { status: 401 }
      );
    }

    const payload = await request.json();

    const {
      event,
      order_id,
      order_number,
      status,
      customer_phone,
      message,
    } = payload;

    // 2. Validate and update order status (Strict Whitelist)
    if (order_id && status) {
      const allowedStatuses = ["pending", "preparing", "ready", "completed", "cancelled"];
      if (allowedStatuses.includes(status)) {
        await supabaseAdmin
          .from("orders")
          .update({ status, updated_at: new Date().toISOString() })
          .eq("id", String(order_id).slice(0, 50));

        await supabaseAdmin
          .from("orders_log")
          .update({ order_status: status, updated_at: new Date().toISOString() })
          .eq("order_id", String(order_id).slice(0, 50));
      }
    }

    // 3. Insert notification log with sequential ID
    const nextNotifId = await getNextSequentialId("notifications", "notif");
    await supabaseAdmin.from("notifications").insert([
      {
        id: nextNotifId,
        name: `Webhook Event: ${String(event || "Inbound Update").slice(0, 80)}`,
        notes: String(message || `Status: ${status || "received"} dari ${customer_phone || "Gateway"}`).slice(0, 300),
        type: "webhook",
        is_read: false,
        created_at: new Date().toISOString(),
      },
    ]);

    return NextResponse.json({
      received: true,
      timestamp: new Date().toISOString(),
      message: "Webhook processed successfully",
    });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { received: false, error: "Gagal memproses event webhook." },
      { status: 400 }
    );
  }
}

export async function GET() {
  // Safe minimal health check response (OWASP API8:2023 - No sensitive info leakage)
  return NextResponse.json({
    status: "ok",
    service: "Webhook Service",
  });
}
