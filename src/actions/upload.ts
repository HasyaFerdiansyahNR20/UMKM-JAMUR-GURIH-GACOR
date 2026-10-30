"use server";

import { supabaseAdmin } from "@/db";
import { requireAdminSession } from "@/lib/serverAuth";

const STORAGE_BUCKET = "products";
const MAX_SERVER_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_MIME_TYPES = ["image/webp", "image/jpeg", "image/jpg", "image/png"];

async function ensureStorageBucketExists() {
  try {
    const { data: bucket, error } = await supabaseAdmin.storage.getBucket(STORAGE_BUCKET);
    if (error || !bucket) {
      await supabaseAdmin.storage.createBucket(STORAGE_BUCKET, {
        public: true,
        fileSizeLimit: MAX_SERVER_FILE_SIZE,
        allowedMimeTypes: ALLOWED_MIME_TYPES,
      });
    }
  } catch (err) {
    // Ignore if bucket already exists
  }
}

export async function uploadProductImageAction(
  formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // 1. Verify authenticated store admin (OWASP A01:2021)
    await requireAdminSession();

    const file = formData.get("file") as File | null;
    const folder = ((formData.get("folder") as string) || "menus")
      .replace(/[^a-z0-9-_]/gi, "")
      .slice(0, 20);

    if (!file || typeof file.arrayBuffer !== "function") {
      return { success: false, error: "File foto tidak ditemukan." };
    }

    // 2. Validate MIME type & file size on server (OWASP A04:2021)
    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      return {
        success: false,
        error: "Tipe file tidak diizinkan. Gunakan foto JPG, PNG, atau WebP.",
      };
    }

    if (file.size > MAX_SERVER_FILE_SIZE) {
      return {
        success: false,
        error: "Ukuran file melebihi batas maksimal 2 MB.",
      };
    }

    // 3. Ensure Supabase Storage bucket exists and upload
    await ensureStorageBucketExists();

    const safeBaseName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .toLowerCase()
      .slice(0, 40);
    const ext = file.type === "image/png" ? "png" : file.type === "image/jpeg" ? "jpg" : "webp";
    const filePath = `${folder}/${Date.now()}-${safeBaseName || "item"}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);

    const { error: uploadError } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, fileBuffer, {
        contentType: file.type || "image/webp",
        upsert: true,
        cacheControl: "31536000",
      });

    if (uploadError) {
      console.warn("Supabase storage upload warning:", uploadError.message);
      return {
        success: false,
        error: uploadError.message,
      };
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrlData.publicUrl,
    };
  } catch (err: any) {
    console.error("Upload action error:", err);
    return {
      success: false,
      error: err.message || "Gagal mengunggah foto ke server.",
    };
  }
}
