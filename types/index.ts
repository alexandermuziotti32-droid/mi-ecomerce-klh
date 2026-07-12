import type { Database } from "./supabase";

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"] & {
  order_items: OrderItem[];
};

export interface SizeStock {
  size: string;
  stock: number;
}

export interface ColorVariant {
  hex: string;
  name: string;
  sizes: SizeStock[];
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  color: string;
  size?: string;
}