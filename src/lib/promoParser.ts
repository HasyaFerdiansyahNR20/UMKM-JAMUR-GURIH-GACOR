import { CartItem, Promotion } from "@/types";
import { formatRupiahShort } from "./utils";

export interface ParsedPromoRule {
  promoId: string;
  title: string;
  subtitle: string;
  discountInfo: string;
  discountType: "fixed" | "percentage";
  discountValue: number; // Nominal Rp (e.g. 5000, 10000) or Percentage (e.g. 20)
  minQuantity: number; // Minimum item quantity required
  requiredVariant: string | null; // Specific flavor/variant required (e.g. "Pedas Manis", "Original", "Pedas", "Manis") or null for any
}

export interface PromoEvaluationResult {
  rule: ParsedPromoRule;
  isEligible: boolean;
  discountAmount: number;
  finalTotal: number;
  matchingQuantity: number;
  reasonIfIneligible?: string;
  summaryLabel: string;
}

const INDONESIAN_NUMBER_WORDS: Record<string, string> = {
  satu: "1",
  sebuah: "1",
  seporsi: "1",
  dua: "2",
  tiga: "3",
  empat: "4",
  lima: "5",
  enam: "6",
  tujuh: "7",
  delapan: "8",
  sembilan: "9",
  sepuluh: "10",
};

function replaceNumberWords(text: string): string {
  let result = text.toLowerCase();
  for (const [word, digit] of Object.entries(INDONESIAN_NUMBER_WORDS)) {
    result = result.replace(new RegExp(`\\b${word}\\b`, "gi"), digit);
  }
  return result;
}

/**
 * Extracts discount type and value from discount_info, title, and subtitle.
 * Handles formats like:
 * - "HEMAT RP 10.000", "Rp 5.000", "10.000"
 * - "diskon 5ribu", "5rb", "10k", "5 ribu"
 * - "Diskon 20%"
 */
function extractDiscountValue(
  discountInfo: string,
  title: string,
  subtitle: string
): { discountType: "fixed" | "percentage"; discountValue: number } {
  const sources = [discountInfo, title, subtitle].filter(Boolean);

  for (const rawSource of sources) {
    const src = rawSource.toLowerCase().trim();
    if (!src) continue;

    // 1. Check percentage (e.g. "20%")
    const percentMatch = src.match(/(\d+(?:[.,]\d+)?)\s*%/);
    if (percentMatch) {
      const pct = parseFloat(percentMatch[1].replace(",", "."));
      if (pct > 0 && pct <= 100) {
        return { discountType: "percentage", discountValue: pct };
      }
    }

    // 2. Check "ribu" / "rb" / "k" (e.g. "5ribu", "5 ribu", "10rb", "10k")
    const ribuMatch = src.match(/(\d+(?:[.,]\d+)?)\s*(?:ribu|rb|k)\b/i);
    if (ribuMatch) {
      const val = Math.round(parseFloat(ribuMatch[1].replace(",", ".")) * 1000);
      if (val >= 500) {
        return { discountType: "fixed", discountValue: val };
      }
    }

    // 3. Check thousand-formatted Rupiah (e.g. "10.000", "5.000", "15,000")
    const formattedMatch = src.match(/\b(\d{1,3}(?:[.,]\d{3})+)\b/);
    if (formattedMatch) {
      const val = parseInt(formattedMatch[1].replace(/[.,]/g, ""), 10);
      if (val >= 500) {
        return { discountType: "fixed", discountValue: val };
      }
    }

    // 4. Check plain 3-6 digit nominal (e.g. "5000", "10000")
    const plainMatch = src.match(/\b(\d{3,6})\b/);
    if (plainMatch) {
      const val = parseInt(plainMatch[1], 10);
      if (val >= 500) {
        return { discountType: "fixed", discountValue: val };
      }
    }
  }

  // Fallback if discount_info has small number like "Hemat 5" -> 5000
  const fallbackSmall = discountInfo.match(/\b(\d{1,2})\b/);
  if (fallbackSmall) {
    const val = parseInt(fallbackSmall[1], 10) * 1000;
    if (val >= 1000) {
      return { discountType: "fixed", discountValue: val };
    }
  }

  return { discountType: "fixed", discountValue: 0 };
}

/**
 * Extracts minimum quantity requirement from subtitle & title.
 * Examples:
 * - "Berlaku setiap 2 pembelian" -> 2
 * - "Beli dua varian pedas manis diskon 5ribu" -> 2
 * - "Minimal pembelian 2 varian apa saja" -> 2
 */
function extractMinQuantity(title: string, subtitle: string): number {
  const combined = replaceNumberWords(`${title} ${subtitle}`);

  // Pattern 1: "setiap 2", "minimal 2", "min 2", "beli 2", "pembelian 2", "minimal pembelian 2"
  const prefixMatch = combined.match(
    /(?:minimal|min\.?|setiap|beli|pembelian)\s+(?:pembelian\s+|beli\s+)?(\d{1,2})\b(?!\s*(?:ribu|rb|k|%|\.\d{3}))/i
  );
  if (prefixMatch) {
    const qty = parseInt(prefixMatch[1], 10);
    if (qty >= 1 && qty <= 50) return qty;
  }

  // Pattern 2: "2 pembelian", "2 porsi", "2 varian", "2 menu", "2 item", "2 bungkus", "2 pack"
  const suffixMatch = combined.match(
    /\b(\d{1,2})\s*(?:pembelian|porsi|varian|menu|item|bungkus|pack|pcs|cup|box)\b/i
  );
  if (suffixMatch) {
    const qty = parseInt(suffixMatch[1], 10);
    if (qty >= 1 && qty <= 50) return qty;
  }

  return 1;
}

/**
 * Extracts required product variant/flavor if specified in title or subtitle.
 * Examples:
 * - "beli dua varian pedas manis diskon 5ribu" -> "Pedas Manis"
 * - "Minimal pembelian 2 varian apa saja" -> null
 */
function extractRequiredVariant(title: string, subtitle: string): string | null {
  const combined = `${title} ${subtitle}`.toLowerCase();

  if (
    combined.includes("varian apa saja") ||
    combined.includes("semua varian") ||
    combined.includes("semua menu") ||
    combined.includes("all variant")
  ) {
    return null;
  }

  if (combined.includes("pedas manis")) {
    return "Pedas Manis";
  }
  if (combined.includes("original")) {
    return "Original";
  }
  if (combined.includes("pedas")) {
    return "Pedas";
  }
  if (combined.includes("manis")) {
    return "Manis";
  }

  return null;
}

export function parsePromotionRule(promo: Promotion): ParsedPromoRule {
  const title = promo.title || "Promo Spesial";
  const subtitle = promo.subtitle || "";
  const discountInfo = promo.discount_info || "";

  const { discountType, discountValue } = extractDiscountValue(
    discountInfo,
    title,
    subtitle
  );
  const minQuantity = extractMinQuantity(title, subtitle);
  const requiredVariant = extractRequiredVariant(title, subtitle);

  return {
    promoId: promo.id,
    title,
    subtitle,
    discountInfo,
    discountType,
    discountValue,
    minQuantity,
    requiredVariant,
  };
}

function doesItemMatchVariant(item: CartItem, requiredVariant: string | null): boolean {
  if (!requiredVariant) return true;

  const target = requiredVariant.toLowerCase();
  const productName = (item.product?.name || "").toLowerCase();
  const sambalOrVariant = (item.selectedSambal || "").toLowerCase();
  const combinedItemText = `${productName} ${sambalOrVariant}`;

  if (target === "pedas manis") {
    return combinedItemText.includes("pedas manis");
  }

  if (target === "pedas") {
    // Match "pedas" but not "pedas manis" unless product is explicitly Pedas
    if (combinedItemText.includes("pedas manis")) return false;
    return combinedItemText.includes("pedas");
  }

  if (target === "manis") {
    if (combinedItemText.includes("pedas manis")) return false;
    return combinedItemText.includes("manis");
  }

  return combinedItemText.includes(target);
}

export function evaluatePromoForCart(
  promo: Promotion,
  items: CartItem[],
  subtotal: number
): PromoEvaluationResult {
  const rule = parsePromotionRule(promo);

  // Calculate matching item count
  const matchingQuantity = items.reduce((sum, item) => {
    if (doesItemMatchVariant(item, rule.requiredVariant)) {
      return sum + item.quantity;
    }
    return sum;
  }, 0);

  const discountLabel =
    rule.discountType === "percentage"
      ? `Diskon ${rule.discountValue}%`
      : rule.discountValue > 0
      ? `Potongan ${formatRupiahShort(rule.discountValue)}`
      : rule.discountInfo || "Promo Spesial";

  const conditionParts: string[] = [];
  if (rule.minQuantity > 1) {
    conditionParts.push(`Min. ${rule.minQuantity} porsi`);
  }
  if (rule.requiredVariant) {
    conditionParts.push(`Varian ${rule.requiredVariant}`);
  }
  const conditionSuffix =
    conditionParts.length > 0 ? ` (${conditionParts.join(" • ")})` : "";

  const summaryLabel = `${rule.title} — ${discountLabel}${conditionSuffix}`;

  // Check eligibility
  if (items.length === 0 || subtotal <= 0) {
    return {
      rule,
      isEligible: false,
      discountAmount: 0,
      finalTotal: subtotal,
      matchingQuantity: 0,
      reasonIfIneligible: "Keranjang masih kosong.",
      summaryLabel,
    };
  }

  if (matchingQuantity < rule.minQuantity) {
    const kurang = rule.minQuantity - matchingQuantity;
    const variantText = rule.requiredVariant
      ? ` varian ${rule.requiredVariant}`
      : "";
    return {
      rule,
      isEligible: false,
      discountAmount: 0,
      finalTotal: subtotal,
      matchingQuantity,
      reasonIfIneligible: `Syarat promo: Minimal beli ${rule.minQuantity} porsi${variantText} (kurang ${kurang} porsi${variantText} lagi di keranjang).`,
      summaryLabel,
    };
  }

  let rawDiscount = 0;
  if (rule.discountType === "percentage") {
    rawDiscount = Math.round((subtotal * rule.discountValue) / 100);
  } else {
    rawDiscount = rule.discountValue;
  }

  const discountAmount = Math.min(subtotal, Math.max(0, rawDiscount));
  const finalTotal = Math.max(0, subtotal - discountAmount);

  return {
    rule,
    isEligible: true,
    discountAmount,
    finalTotal,
    matchingQuantity,
    summaryLabel,
  };
}
