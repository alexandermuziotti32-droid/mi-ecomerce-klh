import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

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

  // 1. Traer los precios REALES desde la base — nunca confiar en el cliente
  const ids = [...new Set(items.map((i) => i.id))];
  const { data: products, error: productsError } = await supabaseAdmin
    .from("products")
    .select("id, name, price")
    .in("id", ids);

  if (productsError || !products) {
    return NextResponse.json({ error: "Error al validar productos" }, { status: 500 });
  }

  const priceMap = new Map(products.map((p) => [p.id, p]));

  // 2. Recalcular el total en el servidor
  let totalAmount = 0;
  const orderItemsPayload = items.map((item) => {
    const product = priceMap.get(item.id);
    if (!product) throw new Error(`Producto ${item.id} no encontrado`);

    const realPrice = product.price ?? 0;
    totalAmount += realPrice * item.quantity;

    return {
      product_id: item.id,
      product_name: product.name,
      price_at_purchase: realPrice,
      quantity: item.quantity,
      size: item.size || "Único",
      color: item.color,
    };
  });

  // 3. Crear la orden
  const { data: orderData, error: orderError } = await supabaseAdmin
    .from("orders")
    .insert([
      {
        customer_name,
        customer_email,
        total_amount: totalAmount,
        status: "pendiente",
      },
    ])
    .select()
    .single();

  if (orderError || !orderData) {
    return NextResponse.json({ error: "Error al crear el pedido" }, { status: 500 });
  }

  // 4. Insertar los items del pedido
  const { error: itemsError } = await supabaseAdmin
    .from("order_items")
    .insert(orderItemsPayload.map((item) => ({ ...item, order_id: orderData.id })));

  if (itemsError) {
    console.error("Error al insertar items:", itemsError);
    return NextResponse.json(
      { error: "Error al guardar los items del pedido" },
      { status: 500 }
    );
  }

  return NextResponse.json({ orderId: orderData.id }, { status: 200 });
}