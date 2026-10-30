import { supabaseAdmin, supabase, FALLBACK_PRODUCTS, FALLBACK_CATEGORIES } from "@/db";
import { Product, Category, AvailabilityStatus } from "@/types";
import { getNextSequentialId } from "@/lib/idGenerator";

export const productService = {
  async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

      if (error || !data || data.length === 0) {
        console.warn("Using fallback categories:", error?.message);
        return FALLBACK_CATEGORIES;
      }
      return data as Category[];
    } catch (err) {
      console.error("Error fetching categories:", err);
      return FALLBACK_CATEGORIES;
    }
  },

  async getProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(*)")
        .order("id", { ascending: true });

      if (error || !data || data.length === 0) {
        console.warn("Using fallback products:", error?.message);
        return FALLBACK_PRODUCTS;
      }

      // Merge and ensure UI fallback properties
      const mapped = data.map((item: any, idx: number) => ({
        ...item,
        category: item.categories,
        card_theme: (idx % 3 === 0 ? "green" : idx % 3 === 1 ? "amber" : "olive") as "green" | "amber" | "olive",
        rating: item.rating || 4.8,
        review_count: item.review_count || 150 + (idx * 47),
      }));

      // If fewer than 4 products in DB, prepend fallback items so the visual layout looks rich
      if (mapped.length < 3) {
        return [...mapped, ...FALLBACK_PRODUCTS.slice(mapped.length)];
      }

      return mapped as Product[];
    } catch (err) {
      console.error("Error fetching products:", err);
      return FALLBACK_PRODUCTS;
    }
  },

  async toggleStock(id: string, newStatus: AvailabilityStatus): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabaseAdmin
        .from("products")
        .update({ availability_status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      console.error("Error toggling stock:", err);
      return { success: false, error: err.message || "Failed to update status" };
    }
  },

  async createProduct(productData: Partial<Product>): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const generatedId = productData.id || await getNextSequentialId("products", "prod");

      // Whitelist fields to prevent Mass Assignment (OWASP API3:2023)
      const sanitizedRecord: Record<string, any> = {
        id: generatedId,
        name: String(productData.name || "").trim().slice(0, 100),
        description: String(productData.description || "").trim().slice(0, 1000),
        price: Number(productData.price) || 0,
        original_price: productData.original_price ? Number(productData.original_price) : null,
        category_id: productData.category_id || null,
        image_url: String(productData.image_url || "").trim(),
        availability_status: productData.availability_status || "available",
        spicy_level: Number(productData.spicy_level) || 0,
        is_bestseller: Boolean(productData.is_bestseller),
        is_promo: Boolean(productData.is_promo),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (Array.isArray(productData.sambal_options)) {
        sanitizedRecord.sambal_options = productData.sambal_options;
      }
      if (Array.isArray(productData.addons)) {
        sanitizedRecord.addons = productData.addons;
      }

      const { data, error } = await supabaseAdmin
        .from("products")
        .insert([sanitizedRecord])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (err: any) {
      console.error("Error creating product:", err);
      return { success: false, error: err.message };
    }
  },

  async updateProduct(id: string, productData: Partial<Product>): Promise<{ success: boolean; error?: string }> {
    try {
      // Whitelist fields to prevent Mass Assignment (OWASP API3:2023)
      const sanitizedRecord: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };

      if (productData.name !== undefined) sanitizedRecord.name = String(productData.name).trim().slice(0, 100);
      if (productData.description !== undefined) sanitizedRecord.description = String(productData.description).trim().slice(0, 1000);
      if (productData.price !== undefined) sanitizedRecord.price = Number(productData.price);
      if (productData.original_price !== undefined) sanitizedRecord.original_price = productData.original_price ? Number(productData.original_price) : null;
      if (productData.category_id !== undefined) sanitizedRecord.category_id = productData.category_id;
      if (productData.image_url !== undefined) sanitizedRecord.image_url = String(productData.image_url).trim();
      if (productData.availability_status !== undefined) sanitizedRecord.availability_status = productData.availability_status;
      if (productData.spicy_level !== undefined) sanitizedRecord.spicy_level = Number(productData.spicy_level);
      if (productData.is_bestseller !== undefined) sanitizedRecord.is_bestseller = Boolean(productData.is_bestseller);
      if (productData.is_promo !== undefined) sanitizedRecord.is_promo = Boolean(productData.is_promo);
      if (Array.isArray(productData.sambal_options)) sanitizedRecord.sambal_options = productData.sambal_options;
      if (Array.isArray(productData.addons)) sanitizedRecord.addons = productData.addons;

      const { error } = await supabaseAdmin
        .from("products")
        .update(sanitizedRecord)
        .eq("id", id);

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      console.error("Error updating product:", err);
      return { success: false, error: err.message };
    }
  },

  async deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      console.error("Error deleting product:", err);
      return { success: false, error: err.message };
    }
  },
};
