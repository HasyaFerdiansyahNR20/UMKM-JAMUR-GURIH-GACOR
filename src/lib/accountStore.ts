import fs from "fs";
import path from "path";
import crypto from "crypto";
import { supabaseAdmin } from "@/db";

export interface StaffAccount {
  id: string;
  username: string;
  email: string;
  password: string;
  role: "admin";
  createdAt: string;
}

export interface OwnerSecurityConfig {
  email: string;
  username: string;
  password: string;
  recoveryEmailPrimary: string;
  recoveryEmailSecondary: string;
  smtpEmail?: string;
  smtpAppPassword?: string;
}

export interface ExtendedStoreSettings {
  storeName: string;
  tagline: string;
  whatsappNumber: string;
  telegramBotUsername: string;
  address: string;
  addressShort: string;
  mapsUrl: string;
  instagramUsername: string;
  instagramUrl: string;
  tiktokUsername: string;
  tiktokUrl: string;
  operatingDays: string;
  operatingHours: string;
  operatingNote: string;
  isOpen: boolean;
  emergencyStaticMode: boolean;
}

export interface SystemConfigData {
  settings: ExtendedStoreSettings;
  owner: OwnerSecurityConfig;
  admins: StaffAccount[];
}

const LOCAL_CONFIG_PATH = path.join(process.cwd(), ".store-system-config.json");
const SUPABASE_CONFIG_ID = "sys-store-config-v1";
const SUPABASE_OTP_ID = "sys-otp-store-v1";

const DEFAULT_CONFIG: SystemConfigData = {
  settings: {
    storeName: process.env.NEXT_PUBLIC_STORE_NAME || "UMKM Gurih Gacor",
    tagline: process.env.NEXT_PUBLIC_STORE_TAGLINE || "KRIUK-KRIUK NYA BIKIN NGILER!",
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "62895634949189",
    telegramBotUsername: process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "GurihGacorBot",
    address:
      process.env.NEXT_PUBLIC_STORE_ADDRESS ||
      "Jl. Reni Jaya Utara 1 Gg. H. Muntir No.4, Pd. Petir, Kec. Bojongsari, Kota Tangerang Selatan, Banten 16517",
    addressShort: "Jl. Reni Jaya Utara 1 Gg. H. Muntir No.4, Tangerang Selatan",
    mapsUrl: "https://maps.app.goo.gl/3vqf68ptrZtxmxbo7",
    instagramUsername: "@gurih.gacor",
    instagramUrl: "https://www.instagram.com/gurih.gacor/",
    tiktokUsername: "@gurih.gacor",
    tiktokUrl: "https://www.tiktok.com/@gurih.gacor",
    operatingDays: "Senin – Minggu",
    operatingHours: "09.00 – 21.00 WIB",
    operatingNote: "*Menerima pesanan online & takeaway setiap hari.",
    isOpen: true,
    emergencyStaticMode: false,
  },
  owner: {
    email: "jamurgurihgacor@gmail.com",
    username: "owner",
    password: process.env.ADMIN_PASSWORD || "admin01",
    recoveryEmailPrimary: "kuliahslebew@gmail.com",
    recoveryEmailSecondary: "fnrhasya@gmail.com",
    smtpEmail: process.env.SMTP_EMAIL || "jamurgurihgacor@gmail.com",
    smtpAppPassword: process.env.SMTP_APP_PASSWORD || "",
  },
  admins: [
    {
      id: "admin-1",
      username: "admin1",
      email: "hasyaferdiansyahnr@gmail.com",
      password: "admin123",
      role: "admin",
      createdAt: new Date().toISOString(),
    },
  ],
};

let memoryConfig: SystemConfigData | null = null;

function mergeWithDefaults(raw: Partial<SystemConfigData> | null): SystemConfigData {
  if (!raw) return structuredClone(DEFAULT_CONFIG);
  return {
    settings: { ...DEFAULT_CONFIG.settings, ...(raw.settings || {}) },
    owner: { ...DEFAULT_CONFIG.owner, ...(raw.owner || {}) },
    admins: Array.isArray(raw.admins) ? raw.admins : DEFAULT_CONFIG.admins,
  };
}

export async function loadSystemConfig(): Promise<SystemConfigData> {
  // 1. Try Supabase notifications config entry first (works across Vercel Serverless & Local)
  try {
    const { data, error } = await supabaseAdmin
      .from("notifications")
      .select("notes")
      .eq("id", SUPABASE_CONFIG_ID)
      .maybeSingle();

    if (!error && data?.notes) {
      const parsed = JSON.parse(data.notes);
      memoryConfig = mergeWithDefaults(parsed);
      return memoryConfig;
    }
  } catch (err) {
    // Fallback to local file
  }

  // 2. Try local file fallback
  try {
    if (fs.existsSync(LOCAL_CONFIG_PATH)) {
      const content = fs.readFileSync(LOCAL_CONFIG_PATH, "utf-8");
      const parsed = JSON.parse(content);
      memoryConfig = mergeWithDefaults(parsed);
      return memoryConfig;
    }
  } catch (err) {
    // Ignore local file read error
  }

  if (memoryConfig) return memoryConfig;
  memoryConfig = structuredClone(DEFAULT_CONFIG);
  return memoryConfig;
}

export async function saveSystemConfig(newConfig: SystemConfigData): Promise<void> {
  memoryConfig = mergeWithDefaults(newConfig);
  const serialized = JSON.stringify(memoryConfig, null, 2);

  // 1. Save to local disk if writable
  try {
    fs.writeFileSync(LOCAL_CONFIG_PATH, serialized, "utf-8");
  } catch (err) {
    // Ignore on read-only serverless fs
  }

  // 2. Save to Supabase so Vercel Serverless Production persists all config & SMTP settings
  try {
    await supabaseAdmin.from("notifications").upsert([
      {
        id: SUPABASE_CONFIG_ID,
        name: "SYSTEM_CONFIG_DO_NOT_DELETE",
        notes: serialized,
        type: "system_config",
        is_read: true,
        created_at: new Date().toISOString(),
      },
    ]);
  } catch (err) {
    console.warn("Could not persist system config to Supabase:", err);
  }
}

// ==========================================
// OTP Challenge Store (Login & Password Reset)
// Serverless-compatible (Supabase + Memory) with CSPRNG & Max 5 Brute-Force Attempts
// ==========================================
export interface OtpRecord {
  code: string;
  email: string;
  username: string;
  role: "owner" | "admin";
  purpose: "login" | "recovery";
  expiresAt: number;
  attempts: number;
}

const MAX_OTP_ATTEMPTS = 5;
const otpStore = new Map<string, OtpRecord>();

async function loadOtpStoreFromDb(): Promise<Record<string, OtpRecord>> {
  try {
    const { data, error } = await supabaseAdmin
      .from("notifications")
      .select("notes")
      .eq("id", SUPABASE_OTP_ID)
      .maybeSingle();

    if (!error && data?.notes) {
      const parsed = JSON.parse(data.notes) as Record<string, OtpRecord>;
      const now = Date.now();
      const cleaned: Record<string, OtpRecord> = {};
      for (const [k, v] of Object.entries(parsed)) {
        if (v && v.expiresAt > now) {
          cleaned[k] = v;
          otpStore.set(k, v);
        }
      }
      return cleaned;
    }
  } catch {
    // Ignore DB read error
  }
  return Object.fromEntries(otpStore.entries());
}

async function saveOtpStoreToDb(records: Record<string, OtpRecord>): Promise<void> {
  try {
    await supabaseAdmin.from("notifications").upsert([
      {
        id: SUPABASE_OTP_ID,
        name: "SYSTEM_OTP_STORE_DO_NOT_DELETE",
        notes: JSON.stringify(records),
        type: "system_otp",
        is_read: true,
        created_at: new Date().toISOString(),
      },
    ]);
  } catch {
    // Ignore DB write error
  }
}

export async function generateOtpChallenge(params: {
  key: string;
  email: string;
  username: string;
  role: "owner" | "admin";
  purpose: "login" | "recovery";
}): Promise<string> {
  // Cryptographically secure 6-digit OTP (OWASP A02:2021)
  const randomNum = crypto.randomInt(100000, 1000000);
  const code = String(randomNum);
  const normalizedKey = params.key.toLowerCase();

  const record: OtpRecord = {
    code,
    email: params.email,
    username: params.username,
    role: params.role,
    purpose: params.purpose,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    attempts: 0,
  };

  otpStore.set(normalizedKey, record);
  const allRecords = await loadOtpStoreFromDb();
  allRecords[normalizedKey] = record;
  await saveOtpStoreToDb(allRecords);

  return code;
}

export async function verifyOtpChallenge(
  key: string,
  code: string,
  purpose: "login" | "recovery",
  consume: boolean = true
): Promise<{ valid: boolean; record?: OtpRecord; error?: string }> {
  const normalizedKey = key.trim().toLowerCase();
  const allRecords = await loadOtpStoreFromDb();
  const record = allRecords[normalizedKey] || otpStore.get(normalizedKey);

  if (!record || record.purpose !== purpose) {
    return {
      valid: false,
      error: "Kode OTP tidak ditemukan atau sudah kadaluarsa. Silakan minta kode baru.",
    };
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(normalizedKey);
    delete allRecords[normalizedKey];
    await saveOtpStoreToDb(allRecords);
    return {
      valid: false,
      error: "Kode OTP sudah melewati batas waktu 5 menit. Silakan minta kode baru.",
    };
  }

  // Constant-time comparison & Brute-force counter (max 5 wrong guesses)
  const cleanCode = code.trim();
  const isMatch =
    cleanCode.length === record.code.length &&
    crypto.timingSafeEqual(Buffer.from(cleanCode), Buffer.from(record.code));

  if (!isMatch) {
    record.attempts = (record.attempts || 0) + 1;
    if (record.attempts >= MAX_OTP_ATTEMPTS) {
      otpStore.delete(normalizedKey);
      delete allRecords[normalizedKey];
      await saveOtpStoreToDb(allRecords);
      return {
        valid: false,
        error: "Terlalu banyak percobaan OTP yang salah (maksimal 5x). Kode OTP telah dihanguskan demi keamanan.",
      };
    }
    otpStore.set(normalizedKey, record);
    allRecords[normalizedKey] = record;
    await saveOtpStoreToDb(allRecords);
    return {
      valid: false,
      error: `Kode OTP 6 digit salah (Sisa percobaan: ${MAX_OTP_ATTEMPTS - record.attempts}x).`,
    };
  }

  // Consume OTP if requested so it cannot be reused
  if (consume) {
    otpStore.delete(normalizedKey);
    delete allRecords[normalizedKey];
    await saveOtpStoreToDb(allRecords);
  }
  return { valid: true, record };
}
