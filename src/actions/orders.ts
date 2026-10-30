"use server";

import { orderService } from "@/services/orderService";
import { CartItem } from "@/types";
import { revalidatePath } from "next/cache";
import { checkoutSchema } from "@/lib/validations";
import { requireAdminSession } from "@/lib/serverAuth";

const ALLOWED_ORDER_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "delivered",
  "cancelled",
] as const;

export async function createOrderAction(input: {
  customerName: string;
  customerPhone: string;
  orderType: "takeaway" | "dine_in" | "delivery";
  deliveryAddress?: string;
  tableNumber?: string;
  notes?: string;
  items: CartItem[];
  totalAmount: number;
}) {
  // 1. Zod input validation
  const validation = checkoutSchema.safeParse({
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    orderType: input.orderType,
    deliveryAddress: input.deliveryAddress,
    tableNumber: input.tableNumber,
    notes: input.notes,
  });

  if (!validation.success) {
    throw new Error("Data pesanan tidak valid: " + validation.error.issues[0]?.message);
  }

  // 2. Business logic sanity check
  if (!input.items || !Array.isArray(input.items) || input.items.length === 0) {
    throw new Error("Keranjang pesanan tidak boleh kosong.");
  }

  if (input.items.length > 50) {
    throw new Error("Jumlah pesanan melebihi batas yang diizinkan (maksimal 50 item).");
  }

  const result = await orderService.createOrder(input);
  revalidatePath("/dashboard");
  return result;
}

export async function fetchOrdersAction() {
  await requireAdminSession();
  return await orderService.getOrders();
}

export async function fetchOrderLogsAction() {
  await requireAdminSession();
  return await orderService.getOrderLogs();
}

export async function updateOrderStatusAction(orderId: string, status: string) {
  await requireAdminSession();

  if (!orderId || typeof orderId !== "string") {
    throw new Error("ID pesanan tidak valid.");
  }

  if (!ALLOWED_ORDER_STATUSES.includes(status as any)) {
    throw new Error(`Status pesanan '${status}' tidak valid.`);
  }

  const result = await orderService.updateOrderStatus(orderId, status);
  revalidatePath("/dashboard");
  return result;
}
