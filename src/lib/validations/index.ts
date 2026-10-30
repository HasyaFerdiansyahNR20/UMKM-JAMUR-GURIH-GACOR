import { z } from "zod";

/**
 * Validates that a string is a safe image URL (http://, https://), an internal static path (/...),
 * or a strictly typed compressed image data URL (data:image/webp|jpeg|png;base64,...).
 * Blocks dangerous schemes like javascript:, data:text/html, vbscript: (OWASP A03:2021)
 */
const safeImageUrlSchema = z
  .string()
  .min(1, "Foto produk wajib diunggah atau dipilih")
  .refine(
    (val) => {
      const trimmed = val.trim();
      if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return true;
      if (/^data:image\/(webp|jpeg|jpg|png);base64,[A-Za-z0-9+/=]+$/i.test(trimmed)) {
        return true;
      }
      try {
        const parsed = new URL(trimmed);
        return parsed.protocol === "https:" || parsed.protocol === "http:";
      } catch {
        return false;
      }
    },
    { message: "Format foto tidak valid (unggah foto JPG/PNG/WebP maks. 2 MB)" }
  );

/**
 * Validates that an optional link URL is a safe anchor (#...), relative path (/...), or http(s) URL
 */
const safeOptionalLinkSchema = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val || val.trim() === "") return true;
      const trimmed = val.trim();
      if (trimmed.startsWith("#") || (trimmed.startsWith("/") && !trimmed.startsWith("//"))) {
        return true;
      }
      try {
        const parsed = new URL(trimmed);
        return parsed.protocol === "https:" || parsed.protocol === "http:";
      } catch {
        return false;
      }
    },
    { message: "Link tujuan tidak valid (gunakan #anchor, /path, atau https://)" }
  );

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Nama minimal 2 karakter").max(100, "Nama terlalu panjang"),
  customerPhone: z
    .string()
    .min(9, "Nomor WhatsApp minimal 9 digit")
    .max(25, "Nomor WhatsApp terlalu panjang")
    .regex(/^[0-9+-\s]+$/, "Nomor WhatsApp tidak valid"),
  orderType: z.enum(["takeaway", "dine_in", "delivery"]),
  deliveryAddress: z.string().max(300, "Alamat terlalu panjang").optional(),
  tableNumber: z.string().max(20, "Nomor meja terlalu panjang").optional(),
  notes: z.string().max(500, "Catatan terlalu panjang").optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const productSchema = z.object({
  name: z.string().min(3, "Nama produk minimal 3 karakter").max(100),
  description: z.string().min(5, "Deskripsi minimal 5 karakter").max(1000),
  category_id: z.string().min(1, "Kategori harus dipilih"),
  price: z.number().min(500, "Harga minimal Rp 500"),
  original_price: z.number().optional().nullable(),
  image_url: safeImageUrlSchema,
  availability_status: z.enum(["available", "unavailable", "sold_out"]),
  spicy_level: z.number().min(0).max(5).default(0),
  is_bestseller: z.boolean().default(false),
  is_promo: z.boolean().default(false),
});

export type ProductFormData = z.infer<typeof productSchema>;

export const promoSchema = z.object({
  title: z.string().min(3, "Judul promo minimal 3 karakter").max(100),
  subtitle: z.string().max(250).optional(),
  badge: z.string().max(50).optional(),
  banner_url: safeImageUrlSchema,
  link_url: safeOptionalLinkSchema,
  cta_text: z.string().max(50).optional(),
  discount_info: z.string().max(100).optional(),
  is_active: z.boolean().default(true),
});

export type PromoFormData = z.infer<typeof promoSchema>;

export const authSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export type AuthFormData = z.infer<typeof authSchema>;
