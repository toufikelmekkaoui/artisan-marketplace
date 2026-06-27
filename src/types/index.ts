export type UserRole = "buyer" | "seller";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
}

export interface Shop {
  id: string;
  owner_id: string;
  shop_name: string;
  description: string | null;
  whatsapp_number: string; // e.g. "966501234567"
  created_at: string;
}

export interface Product {
  id: string;
  shop_id: string;
  seller_id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  // Joined fields
  shop?: Shop;
}

export interface ProductWithShop extends Product {
  shop: Shop;
}
