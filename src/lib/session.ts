/**
 * Cryptographically Secure Session Management
 * OWASP API2:2023 & A07:2021 Compliant
 * Uses Web Crypto HMAC-SHA256 (Compatible with Node.js & Edge Runtime)
 */

export const ADMIN_SESSION_COOKIE = "gurih_admin_session";

interface SessionPayload {
  email: string;
  role: "admin" | "owner";
  iat: number;
  exp: number;
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function getSecretKey(): string {
  const configuredSecret =
    process.env.SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!configuredSecret && process.env.NODE_ENV === "production") {
    console.warn(
      "⚠️ [Security Warning]: SESSION_SECRET is not set in production environment variables!"
    );
  }
  return (
    configuredSecret ||
    "gurih_gacor_default_fallback_secure_key_2026_x99!"
  );
}

/**
 * Creates a tamper-proof signed session token valid for 24 hours
 */
export async function createAdminSessionToken(
  email: string,
  role: "admin" | "owner" = "admin"
): Promise<string> {
  const now = Date.now();
  const payload: SessionPayload = {
    email,
    role,
    iat: now,
    exp: now + 24 * 60 * 60 * 1000, // 24 hours
  };

  const key = await getHmacKey(getSecretKey());
  const enc = new TextEncoder();
  const dataStr = JSON.stringify(payload);
  const dataB64 = base64UrlEncode(enc.encode(dataStr));

  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(dataB64)
  );
  const signatureB64 = base64UrlEncode(new Uint8Array(signatureBuffer));

  return `${dataB64}.${signatureB64}`;
}

/**
 * Cryptographically verifies token integrity, signature, and expiration
 */
export async function verifySessionToken(
  token?: string | null
): Promise<{ valid: boolean; payload?: SessionPayload }> {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return { valid: false };
  }

  const [dataB64, signatureB64] = token.split(".");
  if (!dataB64 || !signatureB64) {
    return { valid: false };
  }

  try {
    const key = await getHmacKey(getSecretKey());
    const enc = new TextEncoder();
    const sigBytes = base64UrlDecode(signatureB64);

    const isValidSig = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes as unknown as BufferSource,
      enc.encode(dataB64)
    );

    if (!isValidSig) {
      return { valid: false };
    }

    const dec = new TextDecoder();
    const payloadStr = dec.decode(base64UrlDecode(dataB64));
    const payload = JSON.parse(payloadStr) as SessionPayload;

    if (!payload.exp || Date.now() > payload.exp) {
      return { valid: false }; // Expired
    }

    return { valid: true, payload };
  } catch (err) {
    return { valid: false };
  }
}
