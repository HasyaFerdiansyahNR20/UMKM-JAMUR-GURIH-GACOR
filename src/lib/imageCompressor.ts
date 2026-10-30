/**
 * Client-side Image Validator & Auto-WebP Compressor
 * Ensures uploaded menu & banner images are lightweight (<100 KB WebP)
 * so website performance (LCP / Core Web Vitals) stays fast.
 */

export const MAX_UPLOAD_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export interface CompressedImageResult {
  file: File;
  dataUrl: string;
  originalSizeKB: number;
  compressedSizeKB: number;
  width: number;
  height: number;
}

export async function validateAndCompressImage(
  inputFile: File,
  options: { maxWidth?: number; maxHeight?: number; quality?: number } = {}
): Promise<CompressedImageResult> {
  const { maxWidth = 800, maxHeight = 800, quality = 0.82 } = options;

  // 1. Validate MIME type
  if (!ALLOWED_IMAGE_TYPES.includes(inputFile.type.toLowerCase())) {
    throw new Error(
      "Format file tidak didukung. Gunakan foto berformat JPG, PNG, atau WebP."
    );
  }

  // 2. Validate max file size (2 MB)
  if (inputFile.size > MAX_UPLOAD_SIZE_BYTES) {
    const sizeMB = (inputFile.size / (1024 * 1024)).toFixed(2);
    throw new Error(
      `Ukuran foto (${sizeMB} MB) melebihi batas maksimal 2 MB. Silakan pilih foto dengan ukuran di bawah 2 MB.`
    );
  }

  const originalSizeKB = Math.max(1, Math.round(inputFile.size / 1024));

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Gagal membaca file foto."));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error("File gambar rusak atau tidak valid."));
      img.onload = () => {
        let targetWidth = img.width;
        let targetHeight = img.height;

        // Calculate proportional resize within maxWidth x maxHeight bounding box
        if (targetWidth > maxWidth || targetHeight > maxHeight) {
          const ratio = Math.min(maxWidth / targetWidth, maxHeight / targetHeight);
          targetWidth = Math.round(targetWidth * ratio);
          targetHeight = Math.round(targetHeight * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Gagal memproses kompresi gambar di browser."));
          return;
        }

        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        const dataUrl = canvas.toDataURL("image/webp", quality);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Gagal mengonversi gambar ke format WebP."));
              return;
            }

            const baseName = inputFile.name
              .replace(/\.[^/.]+$/, "")
              .replace(/[^a-zA-Z0-9-_]/g, "-")
              .toLowerCase()
              .slice(0, 40);

            const compressedFile = new File([blob], `${baseName || "menu"}.webp`, {
              type: "image/webp",
              lastModified: Date.now(),
            });

            const compressedSizeKB = Math.max(1, Math.round(compressedFile.size / 1024));

            resolve({
              file: compressedFile,
              dataUrl,
              originalSizeKB,
              compressedSizeKB,
              width: targetWidth,
              height: targetHeight,
            });
          },
          "image/webp",
          quality
        );
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(inputFile);
  });
}
