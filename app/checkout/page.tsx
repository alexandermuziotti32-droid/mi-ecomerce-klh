"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
  });

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Tu carrito está vacío");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          items: cart.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            color: item.color,
            size: item.size,
          })),
        }),
      });

      if (!response.ok) {
        const { error } = (await response.json()) as { error?: string };
        throw new Error(error ?? "Error desconocido");
      }

      clearCart();
      alert("¡Pedido realizado con éxito!");
      router.push("/");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      console.warn("Error:", message);
      alert(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12 lg:py-20">
      <h1 className="text-4xl font-bold mb-14 uppercase tracking-tighter text-center md:text-left">
        Finalizar Compra
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
        <div className="bg-white p-8 md:p-12 border border-gray-100 shadow-sm rounded-lg space-y-10">
          <h2 className="text-2xl font-semibold border-b pb-4 tracking-tight text-gray-800">
            Datos de Envío
          </h2>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="group">
              <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2 transition-colors group-focus-within:text-black">
                Nombre Completo
              </label>
              <input
                required
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                className="w-full border-b border-gray-200 py-3 outline-none focus:border-black transition-all text-lg"
                placeholder="Ej: Alexander Muziotti"
              />
            </div>
            <div className="group">
              <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2 transition-colors group-focus-within:text-black">
                Correo Electrónico
              </label>
              <input
                required
                type="email"
                name="customer_email"
                value={formData.customer_email}
                onChange={handleChange}
                className="w-full border-b border-gray-200 py-3 outline-none focus:border-black transition-all text-lg"
                placeholder="ejemplo@correo.com"
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full bg-black text-white py-5 mt-10 transition-all uppercase text-sm font-black tracking-[0.2em] shadow-lg ${
                isProcessing ? "opacity-50 cursor-not-allowed" : "hover:bg-zinc-800 hover:scale-[1.01]"
              }`}
            >
              {isProcessing ? "Procesando..." : `Confirmar Pedido ($${totalPrice.toLocaleString()})`}
            </button>
          </form>
        </div>

        <div className="bg-zinc-50 p-8 md:p-12 rounded-xl border border-zinc-100 space-y-8">
          <h2 className="text-2xl font-semibold border-b border-zinc-200 pb-4 tracking-tight">
            Tu Carrito
          </h2>
          <div className="space-y-8 max-h-[500px] overflow-y-auto pr-4">
            {cart.map((item) => (
              <div key={`${item.id}-${item.color}-${item.size}`} className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-baseline gap-3">
                    <h3 className="font-bold text-base leading-none text-zinc-900">{item.name}</h3>
                    <span className="text-zinc-400 font-medium text-sm ml-4 italic underline underline-offset-4 decoration-zinc-200">
                      x{item.quantity}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    {item.size ? `Talle: ${item.size}` : "Pack / Curva"} — {item.color}
                  </p>
                </div>
                <span className="font-black text-lg text-zinc-900 tracking-tighter">
                  ${(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-200 pt-8 mt-4 flex justify-between items-end">
            <div className="space-y-1">
              <span className="text-[11px] uppercase font-bold text-zinc-400 tracking-[0.3em]">
                Total Bruto
              </span>
              <p className="text-3xl font-black tracking-tighter italic">Total a Pagar</p>
            </div>
            <span className="text-4xl font-black tracking-tighter leading-none">
              ${totalPrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}