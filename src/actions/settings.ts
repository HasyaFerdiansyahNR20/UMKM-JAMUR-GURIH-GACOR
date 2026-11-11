"use server";

import { revalidatePath } from "next/cache";
import { requireOwnerSession } from "@/lib/serverAuth";
import {
  ExtendedStoreSettings,
  loadSystemConfig,
  saveSystemConfig,
} from "@/lib/accountStore";

export type StoreSettings = ExtendedStoreSettings;

function sanitizeHttpUrl(rawUrl: string, maxLength: number): string | null {
  const trimmed = rawUrl.trim().slice(0, maxLength);
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

export async function getStoreSettingsAction(): Promise<StoreSettings> {
  const config = await loadSystemConfig();
  return config.settings;
}

export async function updateStoreSettingsAction(
  newSettings: Partial<StoreSettings>
): Promise<{ success: boolean; settings?: StoreSettings; error?: string }> {
  try {
    await requireOwnerSession();

    const config = await loadSystemConfig();
    const sanitized: Partial<StoreSettings> = {};

    if (typeof newSettings.storeName === "string" && newSettings.storeName.trim().length > 0) {
      sanitized.storeName = newSettings.storeName.trim().slice(0, 100);
    }

    if (typeof newSettings.tagline === "string") {
      sanitized.tagline = newSettings.tagline.trim().slice(0, 150);
    }

    if (typeof newSettings.whatsappNumber === "string") {
      const cleanNumber = newSettings.whatsappNumber.replace(/[^0-9]/g, "");
      if (cleanNumber.length >= 9 && cleanNumber.length <= 16) {
        sanitized.whatsappNumber = cleanNumber;
      }
    }

    if (typeof newSettings.telegramBotUsername === "string") {
      sanitized.telegramBotUsername = newSettings.telegramBotUsername
        .trim()
        .replace(/^@/, "")
        .slice(0, 60);
    }

    if (typeof newSettings.address === "string") {
      sanitized.address = newSettings.address.trim().slice(0, 350);
    }

    if (typeof newSettings.addressShort === "string") {
      sanitized.addressShort = newSettings.addressShort.trim().slice(0, 150);
    }

    if (typeof newSettings.mapsUrl === "string") {
      const safeMaps = sanitizeHttpUrl(newSettings.mapsUrl, 300);
      if (safeMaps) sanitized.mapsUrl = safeMaps;
    }

    if (typeof newSettings.instagramUsername === "string") {
      sanitized.instagramUsername = newSettings.instagramUsername.trim().slice(0, 60);
    }

    if (typeof newSettings.instagramUrl === "string") {
      const safeIg = sanitizeHttpUrl(newSettings.instagramUrl, 250);
      if (safeIg) sanitized.instagramUrl = safeIg;
    }

    if (typeof newSettings.tiktokUsername === "string") {
      sanitized.tiktokUsername = newSettings.tiktokUsername.trim().slice(0, 60);
    }

    if (typeof newSettings.tiktokUrl === "string") {
      const safeTt = sanitizeHttpUrl(newSettings.tiktokUrl, 250);
      if (safeTt) sanitized.tiktokUrl = safeTt;
    }

    if (typeof newSettings.operatingDays === "string") {
      sanitized.operatingDays = newSettings.operatingDays.trim().slice(0, 80);
    }

    if (typeof newSettings.operatingHours === "string") {
      sanitized.operatingHours = newSettings.operatingHours.trim().slice(0, 80);
    }

    if (typeof newSettings.operatingNote === "string") {
      sanitized.operatingNote = newSettings.operatingNote.trim().slice(0, 180);
    }

    if (typeof newSettings.isOpen === "boolean") {
      sanitized.isOpen = newSettings.isOpen;
    }

    if (typeof newSettings.emergencyStaticMode === "boolean") {
      sanitized.emergencyStaticMode = newSettings.emergencyStaticMode;
    }

    config.settings = { ...config.settings, ...sanitized };
    await saveSystemConfig(config);

    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: true, settings: config.settings };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal menyimpan pengaturan toko." };
  }
}

export async function toggleEmergencyStaticModeAction(enable: boolean) {
  await requireOwnerSession();
  const config = await loadSystemConfig();
  config.settings.emergencyStaticMode = Boolean(enable);
  await saveSystemConfig(config);
  revalidatePath("/");
  revalidatePath("/dashboard");
  return { success: true, emergencyStaticMode: Boolean(enable) };
}
