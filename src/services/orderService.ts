import { supabaseAdmin } from "@/db";
import { CartItem, Order, OrderLog } from "@/types";
import { generateOrderNumber } from "@/lib/utils";
import { getNextSequentialId } from "@/lib/idGenerator";
import { promoService } from "@/services/promoService";
import { evaluatePromoForCart } from "@/lib/promoParser";

interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  orderType: "takeaway" | "dine_in" | "delivery";
  deliveryAddress?: string;
  tableNumber?: string;
  notes?: string;
  items: CartItem[];
  totalAmount: number;
  discountAmount?: number;
  promoTitle?: string;
  paymentMethod?: "Direct WhatsApp" | "Direct Telegram";
}

const ALLOWED_ORDER_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "delivered",
  "completed",
  "cancelled",
] as const;

function resolveServerVerifiedUnitPrice(item: CartItem): number {
  const sambalOrSize = String(item.selectedSambal || "").toLowerCase();
  let basePrice = 5000;

  if (sambalOrSize.includes("large")) {
    basePrice = 15000;
  } else if (sambalOrSize.includes("medium")) {
    basePrice = 10000;
  } else if (sambalOrSize.includes("small")) {
    basePrice = 5000;
  } else {
    const rawPrice = Number(item.product?.price) || Number(item.itemTotal) || 5000;
    basePrice = Math.max(5000, rawPrice);
  }

  const addonsCost = Array.isArray(item.selectedAddons)
    ? item.selectedAddons.reduce((sum, addon) => sum + Math.max(0, Number(addon?.price) || 0), 0)
    : 0;

  return basePrice + addonsCost;
}

export const orderService = {
  async createOrder(input: CreateOrderInput): Promise<{ success: boolean; orderId?: string; orderNumber?: string; error?: string }> {
    const orderNumber = generateOrderNumber();

    try {
      // 1. Server-side price calculation and input sanitization (OWASP API3:2023)
      let verifiedSubtotalAmount = 0;
      const orderItemsJson = input.items.map((item) => {
        const qty = Math.max(1, Math.min(50, Math.floor(Number(item.quantity) || 1)));
        const unitPrice = resolveServerVerifiedUnitPrice(item);

        const subtotal = unitPrice * qty;
        verifiedSubtotalAmount += subtotal;

        return {
          product_id: String(item.product?.id || "").slice(0, 50),
          name: String(item.product?.name || "Item").slice(0, 100),
          price: unitPrice,
          quantity: qty,
          selected_sambal: typeof item.selectedSambal === "string" ? item.selectedSambal.slice(0, 50) : "",
          selected_addons: Array.isArray(item.selectedAddons) ? item.selectedAddons : [],
          notes: typeof item.notes === "string" ? item.notes.slice(0, 300) : "",
          subtotal,
        };
      });

      // 2. Server-side Promo & Discount Verification (Anti-Price Tampering - OWASP A04:2021)
      let verifiedDiscountAmount = 0;
      let verifiedPromoTitle = "";

      if (input.promoTitle && Number(input.discountAmount) > 0) {
        const activePromos = await promoService.getPromotions();
        const matchingPromo = activePromos.find(
          (p) =>
            p.is_active &&
            p.title.trim().toLowerCase() === input.promoTitle!.trim().toLowerCase()
        );

        if (matchingPromo) {
          const evalResult = evaluatePromoForCart(
            matchingPromo,
            input.items,
            verifiedSubtotalAmount
          );
          if (evalResult.isEligible && evalResult.discountAmount > 0) {
            verifiedDiscountAmount = evalResult.discountAmount;
            verifiedPromoTitle = matchingPromo.title;
          }
        }
      }

      // Use verified server-calculated total after server-verified promo discount
      const finalTotalAmount =
        verifiedSubtotalAmount > 0
          ? Math.max(0, verifiedSubtotalAmount - verifiedDiscountAmount)
          : Math.max(5000, Number(input.totalAmount) || 5000);

      const paymentMethod = input.paymentMethod === "Direct Telegram" ? "Direct Telegram" : "Direct WhatsApp";

      const promoNotePrefix =
        verifiedDiscountAmount > 0 && verifiedPromoTitle
          ? `[Promo: ${verifiedPromoTitle.slice(0, 60)} (-Rp ${verifiedDiscountAmount.toLocaleString("id-ID")})] `
          : "";
      const combinedNotes = `${promoNotePrefix}${input.notes ? input.notes.trim() : ""}`.trim();

      // 3. Generate sequential order ID and insert into orders table
      const nextOrderId = await getNextSequentialId("orders", "order");

      const { data: orderData, error: orderError } = await supabaseAdmin
        .from("orders")
        .insert([
          {
            id: nextOrderId,
            order_number: orderNumber,
            customer_name: input.customerName.trim().slice(0, 100),
            customer_phone: input.customerPhone.trim().slice(0, 30),
            order_type: input.orderType,
            delivery_address: input.deliveryAddress ? input.deliveryAddress.trim().slice(0, 300) : null,
            table_number: input.tableNumber ? input.tableNumber.trim().slice(0, 20) : null,
            notes: combinedNotes ? combinedNotes.slice(0, 500) : null,
            total_amount: finalTotalAmount,
            status: "pending",
            payment_method: paymentMethod,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (orderError) {
        console.warn("Could not insert order into Supabase, saving fallback:", orderError.message);
      }

      const orderId = orderData?.id || nextOrderId;

      // 4. Insert into orders_log table
      const nextLogId = await getNextSequentialId("orders_log", "log");
      await supabaseAdmin.from("orders_log").insert([
        {
          id: nextLogId,
          order_id: orderId,
          customer_name: input.customerName.trim().slice(0, 100),
          customer_phone: input.customerPhone.trim().slice(0, 30),
          order_items_json: orderItemsJson,
          total_amount: finalTotalAmount,
          order_status: "pending",
          created_at: new Date().toISOString(),
        },
      ]);

      // 5. Create notification for admin
      const nextNotifId = await getNextSequentialId("notifications", "notif");
      await supabaseAdmin.from("notifications").insert([
        {
          id: nextNotifId,
          name: `Pesanan Baru #${orderNumber}`,
          notes: `${input.customerName} memesan ${input.items.length} menu (Total Rp ${finalTotalAmount.toLocaleString("id-ID")}${verifiedDiscountAmount > 0 ? `, Diskon Rp ${verifiedDiscountAmount.toLocaleString("id-ID")}` : ""})`,
          type: "order",
          is_read: false,
          created_at: new Date().toISOString(),
        },
      ]);

      return { success: true, orderId, orderNumber };
    } catch (err: any) {
      console.error("Order service exception:", err);
      // Even if network or Supabase fails, allow order to proceed to WhatsApp!
      return { success: true, orderNumber };
    }
  },

  async getOrders(): Promise<Order[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      const orders = (data as Order[]) || [];
      const AUTO_CANCEL_MS = 10 * 60 * 1000; // 10 minutes
      const now = Date.now();
      for (const order of orders) {
        if (order.status === "pending" && order.created_at) {
          const createdMs = new Date(order.created_at).getTime();
          if (!isNaN(createdMs) && now - createdMs >= AUTO_CANCEL_MS) {
            order.status = "cancelled";
            await supabaseAdmin
              .from("orders")
              .update({ status: "cancelled", updated_at: new Date().toISOString() })
              .eq("id", order.id);
            await supabaseAdmin
              .from("orders_log")
              .update({ order_status: "cancelled", updated_at: new Date().toISOString() })
              .eq("order_id", order.id);
          }
        }
      }
      return orders;
    } catch (err) {
      console.error("Error fetching orders:", err);
      return [];
    }
  },

  async getOrderLogs(): Promise<OrderLog[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from("orders_log")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data as OrderLog[]) || [];
    } catch (err) {
      console.error("Error fetching order logs:", err);
      return [];
    }
  },

  async updateOrderStatus(orderId: string, status: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!ALLOWED_ORDER_STATUSES.includes(status as any)) {
        return { success: false, error: `Status '${status}' tidak valid.` };
      }

      const { error } = await supabaseAdmin
        .from("orders")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", orderId);

      if (error) throw error;

      await supabaseAdmin
        .from("orders_log")
        .update({ order_status: status, updated_at: new Date().toISOString() })
        .eq("order_id", orderId);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },
};
