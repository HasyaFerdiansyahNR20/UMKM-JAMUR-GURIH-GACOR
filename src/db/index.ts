import { createClient } from "@supabase/supabase-js";
import { Product, Category, Promotion } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ [Security Warning]: Supabase Public Credentials are missing from environment variables.");
}

// Public / Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Admin / Server-side Supabase client with Service Role privileges
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

/**
 * RESILIENCE LAYER: Fallback Data & Offline Cache
 * Sesuai PRD Non-Fungsional: "Penyediaan salinan data menu dalam cache lokal peramban
 * agar Katalog Produk tetap dapat dibaca meskipun koneksi ke Supabase terputus sementara."
 */

export const FALLBACK_CATEGORIES: Category[] = [
  {
    id: "cat-jamur-rasa",
    store_id: "gurih-gacor-main",
    name: "Varian Rasa Jamur",
    slug: "jamur-rasa",
    icon: "Sparkles",
  },
  {
    id: "cat-jamur-enoki",
    store_id: "gurih-gacor-main",
    name: "Jamur Enoki Crispy",
    slug: "jamur-enoki",
    icon: "Flame",
  },
  {
    id: "cat-jamur-paket",
    store_id: "gurih-gacor-main",
    name: "Paket Jamur & Nasi",
    slug: "paket-jamur",
    icon: "Utensils",
  },
  {
    id: "cat-sambal",
    store_id: "gurih-gacor-main",
    name: "Sambal & Cocolan",
    slug: "sambal",
    icon: "Flame",
  },
  {
    id: "cat-minuman",
    store_id: "gurih-gacor-main",
    name: "Minuman Segar",
    slug: "minuman",
    icon: "Coffee",
  },
];

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    category_id: "cat-jamur-rasa",
    name: "Jamur Crispy Original",
    description: "Jamur tiram segar pilihan dibalut tepung rempah rahasia 7 bumbu khas Gurih Gacor, digoreng garing keemasan. Super renyah di luar, lembut di dalam. KRIUK-KRIUK NYA BIKIN NGILER!",
    price: 18000,
    original_price: 22000,
    image_url: "/products/jamur-crispy-original.webp",
    availability_status: "available",
    spicy_level: 0,
    is_bestseller: true,
    is_promo: true,
    rating: 4.9,
    review_count: 521,
    card_theme: "green",
    sambal_options: ["Sambal Bawang Gacor", "Sambal Matah Bali", "Saus Mayo Barbeque", "Sambal Ijo Gurih"],
    addons: [
      { id: "add-1", name: "Ekstra Nasi Wangi Daun Jeruk", price: 5000 },
      { id: "add-2", name: "Keju Melt Mozzarella", price: 6000 },
      { id: "add-3", name: "Ekstra Sambal 1 Cup", price: 4000 },
    ],
  },
  {
    id: "prod-2",
    category_id: "cat-jamur-rasa",
    name: "Jamur Crispy Pedas",
    description: "Jamur crispy dengan taburan bubuk cabai pedas gurih melimpah yang meresap sempurna. (Catatan: Saat ini tingkat kepedasan standar racikan khas dan belum bisa memilih level pedas).",
    price: 18000,
    original_price: 22000,
    image_url: "/products/jamur-crispy-pedas.webp",
    availability_status: "available",
    spicy_level: 1,
    is_bestseller: true,
    is_promo: false,
    rating: 4.9,
    review_count: 489,
    card_theme: "amber",
    sambal_options: ["Ekstra Bubuk Cabai", "Sambal Bawang Gacor", "Saus Mayo"],
    addons: [
      { id: "add-1", name: "Ekstra Nasi Wangi Daun Jeruk", price: 5000 },
      { id: "add-3", name: "Ekstra Sambal 1 Cup", price: 4000 },
    ],
  },
  {
    id: "prod-3",
    category_id: "cat-jamur-rasa",
    name: "Jamur Crispy Manis",
    description: "Jamur crispy gurih renyah dengan baluran taburan bumbu manis gurih spesial yang legit dan renyah di setiap gigitan.",
    price: 18000,
    original_price: 22000,
    image_url: "/products/jamur-crispy-manis.webp",
    availability_status: "available",
    spicy_level: 0,
    is_bestseller: false,
    is_promo: true,
    rating: 4.8,
    review_count: 342,
    card_theme: "olive",
    sambal_options: ["Saus Mayo Creamy", "Bumbu Manis Gurih Ekstra"],
    addons: [
      { id: "add-3", name: "Ekstra Sambal Cup", price: 4000 },
      { id: "add-4", name: "Es Teh Manis Segar", price: 5000 },
    ],
  },
  {
    id: "prod-4",
    category_id: "cat-jamur-rasa",
    name: "Pedas Manis",
    description: "Perpaduan sempurna sensasi pedas nendang dan manis gurih khas yang membalut jamur crispy renyah. Kombinasi rasa favorit yang bikin nagih!",
    price: 18000,
    original_price: 22000,
    image_url: "/products/jamur-crispy-pedas-manis.webp",
    availability_status: "available",
    spicy_level: 1,
    is_bestseller: true,
    is_promo: true,
    rating: 4.9,
    review_count: 310,
    card_theme: "amber",
    sambal_options: ["Saus Mayo Creamy", "Sambal Bawang"],
    addons: [
      { id: "add-2", name: "Keju Melt Mozzarella", price: 6000 },
      { id: "add-3", name: "Ekstra Sambal 1 Cup", price: 4000 },
    ],
  },
];

export const FALLBACK_PROMOTIONS: Promotion[] = [];
