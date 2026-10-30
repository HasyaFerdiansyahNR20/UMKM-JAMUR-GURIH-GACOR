import { NextResponse } from "next/server";
import { productService } from "@/services/productService";
import { productSchema } from "@/lib/validations";
import { checkAdminAuth } from "@/lib/serverAuth";
import { verifySessionToken } from "@/lib/session";

export async function GET() {
  try {
    const [products, categories] = await Promise.all([
      productService.getProducts(),
      productService.getCategories(),
    ]);

    return NextResponse.json({
      success: true,
      products,
      categories,
    });
  } catch (error: any) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data produk katalog." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const adminKey = request.headers.get("x-admin-key");
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    let isAuthorized = false;

    // 1. Verify via Service Role Key
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
          error: "Unauthorized: Penambahan produk katalog memerlukan autentikasi staf pengelola.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Input validation with Zod
    const validation = productSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validasi data produk gagal",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const result = await productService.createProduct(validation.data as any);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server saat menyimpan produk." },
      { status: 500 }
    );
  }
}
