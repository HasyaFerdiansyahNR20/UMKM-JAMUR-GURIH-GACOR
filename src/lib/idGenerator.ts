import { supabaseAdmin } from "@/db";

const ALLOWED_TABLES = new Set([
  "categories",
  "products",
  "orders",
  "notifications",
  "orders_log",
  "promotions",
  "profiles",
  "payments",
]);

/**
 * Generator ID Rapi & Berurutan untuk Seluruh Tabel Database Supabase
 * Dioptimalkan dengan Limit & Whitelist (OWASP API4:2023 - Anti Memory Exhaustion)
 * Format: [prefix]-[nomor_urut] (Contoh: prod-5, promo-3, order-1, log-1, notif-1, cat-6)
 */
export async function getNextSequentialId(
  tableName: string,
  prefix: string
): Promise<string> {
  // 1. Table name injection prevention
  if (!ALLOWED_TABLES.has(tableName)) {
    console.warn(`[idGenerator] Untrusted table name: ${tableName}, using timestamp.`);
    return `${prefix}-${Date.now()}`;
  }

  try {
    // 2. Fetch with limit to prevent full-table memory exhaustion (OWASP API4:2023)
    let queryResult = await supabaseAdmin
      .from(tableName)
      .select("id")
      .order("created_at", { ascending: false })
      .limit(30);

    // Fallback if table doesn't have created_at column
    if (queryResult.error) {
      queryResult = await supabaseAdmin
        .from(tableName)
        .select("id")
        .limit(30);
    }

    const { data, error } = queryResult;

    if (error || !data) {
      console.warn(`[idGenerator] Could not fetch IDs for ${tableName}, using timestamp fallback:`, error?.message);
      return `${prefix}-${Date.now()}`;
    }

    const regex = new RegExp(`^${prefix}-(\\d+)$`);
    let maxNumber = 0;

    for (const row of data) {
      const idStr = String(row.id || "");
      const match = idStr.match(regex);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNumber) {
          maxNumber = num;
        }
      }
    }

    if (maxNumber === 0 && data.length > 0) {
      maxNumber = data.length;
    }

    const nextId = `${prefix}-${maxNumber + 1}`;
    return nextId;
  } catch (err) {
    console.error(`[idGenerator] Exception generating ID for ${tableName}:`, err);
    return `${prefix}-${Date.now()}`;
  }
}
