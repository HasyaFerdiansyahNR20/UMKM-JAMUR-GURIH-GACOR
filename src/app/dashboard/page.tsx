import { redirect } from "next/navigation";
import { checkAdminAuth } from "@/lib/serverAuth";
import { productService } from "@/services/productService";
import { promoService } from "@/services/promoService";
import { orderService } from "@/services/orderService";
import { getStoreSettingsAction } from "@/actions/settings";
import { AdminDashboardClient } from "./AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Server-side Defense-in-Depth Authentication Check (OWASP A01:2021)
  const auth = await checkAdminAuth();
  if (!auth.isAuthenticated) {
    redirect("/admin?from=/dashboard");
  }

  const [products, categories, promotions, orders, orderLogs, settings] = await Promise.all([
    productService.getProducts(),
    productService.getCategories(),
    promoService.getAllPromotions(),
    orderService.getOrders(),
    orderService.getOrderLogs(),
    getStoreSettingsAction(),
  ]);

  return (
    <AdminDashboardClient
      products={products}
      categories={categories}
      promotions={promotions}
      orders={orders}
      orderLogs={orderLogs}
      initialSettings={settings}
    />
  );
}
