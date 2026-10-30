export type AvailabilityStatus = "available" | "unavailable" | "sold_out";
export type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "completed" | "cancelled";
export type PaymentStatus = "unpaid" | "paid" | "expired" | "refunded";
export type UserRole = "admin" | "staff" | "customer";

export interface Category {
  id: string;
  store_id: string;
  name: string;
  slug?: string;
  icon?: string;
  created_at?: string;
}

export interface ProductAddon {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  user_id?: string | null;
  category_id?: string | null;
  name: string;
  description: string;
  price: number;
  original_price?: number | null;
  image_url: string;
  availability_status: AvailabilityStatus | string;
  spicy_level?: number;
  is_bestseller?: boolean;
  is_promo?: boolean;
  sambal_options?: string[];
  addons?: ProductAddon[];
  created_at?: string;
  updated_at?: string;
  // Computed / UI helper properties
  category?: Category;
  card_theme?: "green" | "amber" | "olive";
  rating?: number;
  review_count?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSambal?: string;
  selectedAddons?: ProductAddon[];
  notes?: string;
  itemTotal: number;
}

export interface Order {
  id: string;
  order_number?: string;
  user_id?: string | null;
  customer_id?: string | null;
  customer_name: string;
  customer_phone: string;
  order_type?: "takeaway" | "dine_in" | "delivery";
  delivery_address?: string;
  table_number?: string;
  notes?: string;
  total_amount: number;
  status: OrderStatus | string;
  payment_method: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrderItemJson {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  selected_sambal?: string;
  selected_addons?: ProductAddon[];
  notes?: string;
  subtotal: number;
}

export interface OrderLog {
  id: string;
  order_id?: string | null;
  user_id?: string | null;
  customer_name: string;
  customer_phone: string;
  order_items_json: OrderItemJson[];
  total_amount: number;
  order_status: string;
  created_at?: string;
  updated_at?: string;
}

export interface Promotion {
  id: string;
  user_id?: string | null;
  title: string;
  subtitle?: string;
  badge?: string;
  banner_url: string;
  link_url?: string;
  cta_text?: string;
  discount_info?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  user_id?: string | null;
  email: string;
  role: UserRole | string;
  created_at?: string;
  updated_at?: string;
}

export interface Notification {
  id: string;
  user_id?: string | null;
  name: string;
  notes?: string;
  type?: string;
  is_read: boolean;
  created_at?: string;
}

export interface Payment {
  id: string;
  user_id?: string | null;
  order_id?: string | null;
  invoice_number?: string;
  amount: number;
  payment_method: string;
  payment_status: PaymentStatus | string;
  paid_at?: string;
  created_at?: string;
}
