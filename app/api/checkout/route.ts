import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase/server";

interface CheckoutItem {
  id: number;
  quantity: number;
  color: string;
  size?: string;
}

interface CheckoutBody {
  customer_name: string;
  customer_email: string;
  items: CheckoutItem[];
}

export async function POST(request: Request) {
  const body = (await request.json()) as CheckoutBody;
  const { customer_name, customer_email, items } = body;

  if (!customer_name?.trim() || !customer_email?.trim()) {
    return NextResponse.json({ error: "Datos de cliente incompletos" }, { status: 400 });
  }

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 });
  }

  // Si hay sesión activa, el pedido queda vinculado a la cuenta.
  // Si no, sigue funcionando como compra de invitado (user_id null).
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const rpcItems = items.map((item) => ({
    product_id: item.id,
    quantity: item.quantity,
    color: item.color,
    size: item.size ?? null,
  }));

  const { data: orderId, error } = await supabaseAdmin.rpc("create_order", {
    customer_name,
    customer_email,
    items: rpcItems,
    p_user_id: user?.id ?? null,
  });

  if (error) {
    console.error("Error en create_order:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  revalidatePath("/");
  items.forEach((item) => revalidatePath(`/product/${item.id}`));
  return NextResponse.json({ orderId }, { status: 200 });
}