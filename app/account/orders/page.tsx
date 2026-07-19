import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Order } from "@/types";

export default async function OrderHistoryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: orders } = await supabase
    .from("orders")
    .select(`*, order_items (*)`)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const orderList = (orders as Order[] | null) ?? [];

  return (
    <main className="max-w-4xl mx-auto px-8 py-20">
      <h1 className="text-3xl font-bold uppercase tracking-tighter mb-10">
        Mis Pedidos
      </h1>

      {orderList.length === 0 ? (
        <p className="text-gray-400 italic">
          Todavía no hiciste ningún pedido.
        </p>
      ) : (
        <div className="space-y-6">
          {orderList.map((order) => (
            <div
              key={order.id}
              className="border border-gray-100 rounded-xl p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">
                    {new Date(order.created_at).toLocaleDateString("es-AR")}
                  </p>
                  <p className="font-bold">
                    ${order.total_amount.toLocaleString()}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full ${
                    order.status === "pendiente"
                      ? "bg-orange-50 text-orange-600"
                      : "bg-green-50 text-green-600"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                {order.order_items.map((item) => (
                  <li key={item.id}>
                    {item.quantity}x {item.product_name} — {item.color} /{" "}
                    {item.size}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
