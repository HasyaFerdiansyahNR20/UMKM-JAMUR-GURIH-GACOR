import { redirect } from "next/navigation";
import { checkAdminAuth } from "@/lib/serverAuth";
import { productService } from "@/services/productService";
import { promoService } from "@/services/promoService";
import { orderService } from "@/services/orderService";
import { loadSystemConfig, OwnerSecurityConfig } from "@/lib/accountStore";
import { AdminDashboardClient } from "./AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Server-side Defense-in-Depth Authentication Check (OWASP A01:2021)
  const auth = await checkAdminAuth();
  if (!auth.isAuthenticated) {
    redirect("/admin?from=/dashboard");
  }

  const [products, categories, promotions, orders, orderLogs, sysConfig] = await Promise.all([
    productService.getProducts(),
    productService.getCategories(),
    promoService.getAllPromotions(),
    orderService.getOrders(),
    orderService.getOrderLogs(),
    loadSystemConfig(),
  ]);

  const userRole = auth.role === "owner" ? "owner" : "admin";

  // Security Hardening (OWASP API3:2023 - Broken Object Property Level Authorization):
  // Never expose Owner password or SMTP credentials in RSC payload to "admin" (Karyawan) role!
  const safeOwnerForClient: OwnerSecurityConfig =
    userRole === "owner"
      ? {
          ...sysConfig.owner,
          password: "", // Never serialize plaintext owner password to client DOM
        }
      : {
          email: "",
          username: "",
          password: "",
          recoveryEmailPrimary: "",
          recoveryEmailSecondary: "",
          smtpEmail: "",
          smtpAppPassword: "",
        };

  const safeAdminsForClient = userRole === "owner" ? sysConfig.admins : [];

  return (
    <AdminDashboardClient
      userRole={userRole}
      userEmail={auth.email || ""}
      userName={auth.username || "Pengelola"}
      products={products}
      categories={categories}
      promotions={promotions}
      orders={orders}
      orderLogs={orderLogs}
      initialSettings={sysConfig.settings}
      initialOwner={safeOwnerForClient}
      initialAdmins={safeAdminsForClient}
    />
  );
}
