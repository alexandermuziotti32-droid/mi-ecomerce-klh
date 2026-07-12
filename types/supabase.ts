export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: number;
          name: string;
          price: number | null;
          description: string | null;
          images: string[] | null;
          colors: Json | null;
        };
        Insert: {
          id?: number;
          name: string;
          price?: number | null;
          description?: string | null;
          images?: string[] | null;
          colors?: Json | null;
        };
        Update: {
          id?: number;
          name?: string;
          price?: number | null;
          description?: string | null;
          images?: string[] | null;
          colors?: Json | null;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          role: "customer" | "admin";
        };
        Insert: {
          id: string;
          email: string;
          role?: "customer" | "admin";
        };
        Update: {
          id?: string;
          email?: string;
          role?: "customer" | "admin";
        };
      };
      orders: {
        Row: {
          id: number;
          customer_name: string;
          customer_email: string;
          total_amount: number;
          status: "pendiente" | "enviado" | "entregado" | "cancelado";
          created_at: string;
        };
        Insert: {
          id?: number;
          customer_name: string;
          customer_email: string;
          total_amount: number;
          status?: "pendiente" | "enviado" | "entregado" | "cancelado";
          created_at?: string;
        };
        Update: {
          id?: number;
          customer_name?: string;
          customer_email?: string;
          total_amount?: number;
          status?: "pendiente" | "enviado" | "entregado" | "cancelado";
          created_at?: string;
        };
      };
      order_items: {
        Row: {
          id: number;
          order_id: number;
          product_id: number;
          product_name: string;
          price_at_purchase: number;
          quantity: number;
          size: string;
          color: string;
        };
        Insert: {
          id?: number;
          order_id: number;
          product_id: number;
          product_name: string;
          price_at_purchase: number;
          quantity: number;
          size: string;
          color: string;
        };
        Update: {
          id?: number;
          order_id?: number;
          product_id?: number;
          product_name?: string;
          price_at_purchase?: number;
          quantity?: number;
          size?: string;
          color?: string;
        };
      };
    };
  };
}