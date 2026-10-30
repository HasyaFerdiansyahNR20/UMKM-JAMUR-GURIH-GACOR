"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/serverAuth";

export interface StoreSettings {
  storeName: string;
  tagline: string;
  whatsappNumber: string;
  address: string;
  isOpen: boolean;
  emergencyStaticMode: boolean;
}

// In-memory / environment backed settings state with defaults
let currentSettings: StoreSettings = {
  storeName: process.env.NEXT_PUBLIC_STORE_NAME || "UMKM Gurih Gacor",
  tagline: process.env.NEXT_PUBLIC_STORE_TAGLINE || "KRIUK-KRIUK NYA BIKIN NGILER!",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "628981613310",
  address: process.env.NEXT_PUBLIC_STORE_ADDRESS || "Jl. Reni Jaya Utara 1 Gg. H. Muntir No.4, Pd. Petir, Kec. Bojongsari, Kota Tangerang Selatan, Banten 16517",
  isOpen: true,
  emergencyStaticMode: false,
};

export async function getStoreSettingsAction(): Promise<StoreSettings> {
  return currentSettings;
}

export async function updateStoreSettingsAction(newSettings: Partial<StoreSettings>) {
  // Enforce admin authorization (OWASP API5:2023)
  await requireAdminSession();

  // Sanitize and whitelist fields to prevent pollution or hijacking
  const sanitized: Partial<StoreSettings> = {};

  if (typeof newSettings.storeName === "string" && newSettings.storeName.trim().length > 0) {
    sanitized.storeName = newSettings.storeName.trim().slice(0, 100);
  }

  if (typeof newSettings.tagline === "string") {
    sanitized.tagline = newSettings.tagline.trim().slice(0, 150);
  }

  if (typeof newSettings.whatsappNumber === "string") {
    // Only allow numbers for WhatsApp
    const cleanNumber = newSettings.whatsappNumber.replace(/[^0-9]/g, "");
    if (cleanNumber.length >= 9 && cleanNumber.length <= 16) {
      sanitized.whatsappNumber = cleanNumber;
    }
  }

  if (typeof newSettings.address === "string") {
    sanitized.address = newSettings.address.trim().slice(0, 300);
  }

  if (typeof newSettings.isOpen === "boolean") {
    sanitized.isOpen = newSettings.isOpen;
  }

  if (typeof newSettings.emergencyStaticMode === "boolean") {
    sanitized.emergencyStaticMode = newSettings.emergencyStaticMode;
  }

  currentSettings = { ...currentSettings, ...sanitized };
  revalidatePath("/");
  revalidatePath("/dashboard");
  return { success: true, settings: currentSettings };
}

export async function toggleEmergencyStaticModeAction(enable: boolean) {
  await requireAdminSession();
  currentSettings.emergencyStaticMode = Boolean(enable);
  revalidatePath("/");
  revalidatePath("/dashboard");
  return { success: true, emergencyStaticMode: Boolean(enable) };
}
