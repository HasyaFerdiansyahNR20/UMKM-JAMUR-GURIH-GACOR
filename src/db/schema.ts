/**
 * Database Schema Definitions for Supabase PostgreSQL
 * Sesuai spesifikasi PRD UMKM-GURIH-GACOR
 */

export const TABLES = {
  CATEGORIES: "categories",
  PRODUCTS: "products",
  ORDERS: "orders",
  NOTIFICATIONS: "notifications",
  AUTHUSERS: "authusers",
  ORDERS_LOG: "orders_log",
  PAYMENTS: "payments",
  PROFILES: "profiles",
  PROMOTIONS: "promotions",
} as const;

export type TableNames = (typeof TABLES)[keyof typeof TABLES];
