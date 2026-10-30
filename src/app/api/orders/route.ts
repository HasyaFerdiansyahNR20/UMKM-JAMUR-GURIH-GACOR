import { NextResponse } from "next/server";
import { orderService } from "@/services/orderService";
import { checkoutSchema } from "@/lib/validations";
import { checkAdminAuth } from "@/lib/serverAuth";
import { verifySessionToken } from "@/lib/session";

export async function GET(request: Request) {
  try {
    const adminKey = request.headers.get("x-admin-key");
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    let isAuthorized = false;

    // 1. Verify via internal Service Role Key
    if (serviceRoleKey && adminKey && adminKey === serviceRoleKey) {
      isAuthorized = true;
    }

    // 2. Verify via signed admin session cookie
    if (!isAuthorized) {
      const auth = await checkAdminAuth();
      if (auth.isAuthenticated) {
        isAuthorized = true;
      }
    }

    // 3. Verify via cryptographically signed Bearer session token
    if (!isAuthorized) {
      const authHeader = request.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.replace("Bearer ", "").trim();
        const verification = await verifySessionToken(token);
        if (verification.valid) {
          isAuthorized = true;
        }
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Akses data pemesan dibatasi hanya untuk staf pengelola toko terautentikasi.",
        },
        { status: 401 }
      );
    }

    const orders = await orderService.getOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server saat mengambil data pesanan." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validate customer & order information with Zod
    const validation = checkoutSchema.safeParse({
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      orderType: body.orderType,
      deliveryAddress: body.deliveryAddress,
      tableNumber: body.tableNumber,
      notes: body.notes,
    });

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validasi data pesanan gagal",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // 2. Ensure items array exists and is valid
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Keranjang pesanan tidak boleh kosong." },
        { status: 400 }
      );
    }

    // 3. Prevent excessive item count (Anti-Spam / DoS - OWASP API4:2023)
    if (body.items.length > 50) {
      return NextResponse.json(
        { success: false, error: "Jumlah item melebihi batas wajar (maksimal 50 item per order)." },
        { status: 400 }
      );
    }

    // 4. Validate each item basic structure
    for (const item of body.items) {
      if (!item || typeof item !== "object") {
        return NextResponse.json(
          { success: false, error: "Format data item pesanan tidak valid." },
          { status: 400 }
        );
      }
      const qty = Number(item.quantity);
      if (isNaN(qty) || qty < 1 || qty > 100) {
        return NextResponse.json(
          { success: false, error: "Jumlah kuantitas item tidak wajar (1 - 100)." },
          { status: 400 }
        );
      }
    }

    const result = await orderService.createOrder(body);

    return NextResponse.json({
      success: true,
      orderNumber: result.orderNumber,
      orderId: result.orderId,
    });
  } catch (error: any) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server saat memproses pesanan." },
      { status: 500 }
    );
  }
}
