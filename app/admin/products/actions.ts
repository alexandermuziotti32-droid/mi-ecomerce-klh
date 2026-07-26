"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Json } from "@/types/supabase";

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No autenticado");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("No autorizado");
}

export interface ProductInput {
  id?: number;
  name: string;
  price: number;
  description: string;
  images: string[];
  colors: Json;
}

export async function createProduct(input: ProductInput) {
  await assertAdmin();

  const { data, error } = await supabaseAdmin
    .from("products")
    .insert([input])
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/admin/products");
  return data;
}

export async function updateProduct(id: number, input: ProductInput) {
  await assertAdmin();

  const { error } = await supabaseAdmin.from("products").update(input).eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
}

export async function deleteProduct(id: number) {
  await assertAdmin();

  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/products");
}