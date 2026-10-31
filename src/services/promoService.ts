import { supabase, supabaseAdmin } from "@/db";
import { Promotion } from "@/types";
import { getNextSequentialId } from "@/lib/idGenerator";

export const promoService = {
  async getPromotions(): Promise<Promotion[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from("promotions")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Error fetching promotions:", error.message);
        return [];
      }
      return (data || []) as Promotion[];
    } catch (err) {
      console.error("Error fetching promotions:", err);
      return [];
    }
  },

  async getAllPromotions(): Promise<Promotion[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from("promotions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        return [];
      }
      return (data || []) as Promotion[];
    } catch (err) {
      return [];
    }
  },

  async createPromotion(promoData: Partial<Promotion>): Promise<{ success: boolean; data?: Promotion; error?: string }> {
    try {
      const generatedId = promoData.id || await getNextSequentialId("promotions", "promo");

      const sanitizedRecord: Record<string, any> = {
        id: generatedId,
        title: String(promoData.title || "").trim().slice(0, 100),
        subtitle: promoData.subtitle ? String(promoData.subtitle).trim().slice(0, 200) : null,
        badge: promoData.badge ? String(promoData.badge).trim().slice(0, 50) : null,
        banner_url: String(promoData.banner_url || "").trim(),
        link_url: promoData.link_url ? String(promoData.link_url).trim() : null,
        cta_text: promoData.cta_text ? String(promoData.cta_text).trim().slice(0, 50) : null,
        discount_info: promoData.discount_info ? String(promoData.discount_info).trim().slice(0, 100) : null,
        is_active: promoData.is_active !== undefined ? Boolean(promoData.is_active) : true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabaseAdmin
        .from("promotions")
        .insert([sanitizedRecord])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: (data || sanitizedRecord) as Promotion };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async togglePromotionStatus(id: string, isActive: boolean): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabaseAdmin
        .from("promotions")
        .update({ is_active: isActive, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async deletePromotion(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabaseAdmin.from("promotions").delete().eq("id", id);
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },
};
