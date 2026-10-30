import { z } from "zod";

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Nama minimal 2 karakter"),
  customerPhone: z
    .string()
    .min(9, "Nomor WhatsApp minimal 9 digit")
    .regex(/^[0-9+-\s]+$/, "Nomor WhatsApp tidak valid"),
  orderType: z.enum(["takeaway", "dine_in", "delivery"]),
  deliveryAddress: z.string().optional(),
  tableNumber: z.string().optional(),
  notes: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const productSchema = z.object({
  name: z.string().min(3, "Nama produk minimal 3 karakter"),
  description: z.string().min(5, "Deskripsi minimal 5 karakter"),
  category_id: z.string().min(1, "Kategori harus dipilih"),
  price: z.number().min(500, "Harga minimal Rp 500"),
  original_price: z.number().optional().nullable(),
  image_url: z.string().url("URL Gambar harus valid"),
  availability_status: z.enum(["available", "unavailable", "sold_out"]),
  spicy_level: z.number().min(0).max(5).default(0),
  is_bestseller: z.boolean().default(false),
  is_promo: z.boolean().default(false),
});

export type ProductFormData = z.infer<typeof productSchema>;

export const promoSchema = z.object({
  title: z.string().min(3, "Judul promo minimal 3 karakter"),
  subtitle: z.string().optional(),
  badge: z.string().optional(),
  banner_url: z.string().url("URL Banner harus valid"),
  link_url: z.string().optional(),
  cta_text: z.string().optional(),
  discount_info: z.string().optional(),
  is_active: z.boolean().default(true),
});

export type PromoFormData = z.infer<typeof promoSchema>;

export const authSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export type AuthFormData = z.infer<typeof authSchema>;
