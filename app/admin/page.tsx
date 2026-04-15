"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Package, Clock, CheckCircle, ChevronDown, ExternalLink } from "lucide-react";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    // Esta consulta es clave: trae la orden y todos sus items vinculados
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (*)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error cargando pedidos:", error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (!error) fetchOrders(); // Recargamos para ver el cambio
  };

  if (loading) return <div className="p-20 text-center animate-pulse uppercase tracking-widest text-xs">Cargando Panel de Control...</div>;

  return (
    <div className="max-w-7xl mx-auto p-8 lg:py-16">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-bold uppercase tracking-tighter">Panel de Pedidos</h1>
          <p className="text-gray-400 text-sm mt-2">Gestiona las ventas y estados de KLH</p>
        </div>
        <div className="bg-black text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest">
          {orders.length} Pedidos Totales
        </div>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* CABECERA DEL PEDIDO */}
            <div className="bg-gray-50/50 p-6 flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-lg border border-gray-100">
                  <Package className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm uppercase">{order.customer_name}</h3>
                  <p className="text-xs text-gray-400">{order.customer_email}</p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Total</p>
                  <p className="font-black text-lg">${order.total_amount.toLocaleString()}</p>
                </div>
                
                <select 
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full border cursor-pointer outline-none transition-colors ${
                    order.status === 'pendiente' ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-green-50 border-green-200 text-green-600'
                  }`}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="enviado">Enviado</option>
                  <option value="entregado">Entregado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            </div>

            {/* DETALLE DE PRODUCTOS */}
            <div className="p-6 border-t border-gray-50">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[9px] uppercase font-bold text-gray-400 tracking-[0.2em] border-b border-gray-50">
                    <th className="pb-4">Producto</th>
                    <th className="pb-4">Detalle</th>
                    <th className="pb-4">Cantidad</th>
                    <th className="pb-4 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {order.order_items?.map((item: any) => (
                    <tr key={item.id} className="text-sm">
                      <td className="py-4 font-medium">{item.product_name}</td>
                      <td className="py-4">
                        <span className="text-[10px] bg-gray-100 px-2 py-1 rounded font-bold uppercase mr-2">
                          {item.color}
                        </span>
                        <span className="text-[10px] bg-zinc-800 text-white px-2 py-1 rounded font-bold uppercase">
                          {item.size || "Pack"}
                        </span>
                      </td>
                      <td className="py-4 text-gray-500">x{item.quantity}</td>
                      <td className="py-4 text-right font-bold">${(item.price_at_purchase * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
