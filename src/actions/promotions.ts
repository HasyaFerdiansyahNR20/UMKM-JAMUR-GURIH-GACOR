"use server";

import { promoService } from "@/services/promoService";
import { Promotion } from "@/types";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/serverAuth";
import { promoSchema } from "@/lib/validations";

export async function fetchPromotionsAction() {
  return await promoService.getPromotions();
}

export async function fetchAllPromotionsAction() {
  await requireAdminSession();
  return await promoService.getAllPromotions();
}

export async function createPromotionAction(promoData: Partial<Promotion>) {
  await requireAdminSession();

  const validation = promoSchema.safeParse(promoData);
  if (!validation.success) {
    throw new Error(
      "Data banner promo tidak valid: " +
        validation.error.issues.map((i) => i.message).join(", ")
    );
  }

  const result = await promoService.createPromotion(validation.data as any);
  revalidatePath("/");
  revalidatePath("/dashboard");
  return result;
}

export async function togglePromotionStatusAction(id: string, isActive: boolean) {
  await requireAdminSession();

  if (!id || typeof id !== "string") {
    throw new Error("ID promo wajib diisi.");
  }

  const result = await promoService.togglePromotionStatus(id, Boolean(isActive));
  revalidatePath("/");
  revalidatePath("/dashboard");
  return result;
}

export async function deletePromotionAction(id: string) {
  await requireAdminSession();

  if (!id || typeof id !== "string") {
    throw new Error("ID promo wajib diisi.");
  }

  const result = await promoService.deletePromotion(id);
  revalidatePath("/");
  revalidatePath("/dashboard");
  return result;
}
