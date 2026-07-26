"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Order } from "@/types";

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

export async function updateOrderStatus(orderId: string, newStatus: Order["status"]) {
  await assertAdmin();

  if (newStatus === "cancelado") {
    const { error } = await supabaseAdmin.rpc("cancel_order", { p_order_id: orderId });
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabaseAdmin
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin");
}