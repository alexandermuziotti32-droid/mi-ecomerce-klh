"use client";
import { useCart } from "@/context/CartContext";
import { X, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";

export const CartDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { cart, removeFromCart, totalItems } = useCart();

  // Calcular el subtotal
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <>
      {/* Fondo oscuro (Overlay) que cierra el carrito al hacer clic fuera */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* El Panel Lateral */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white/80 backdrop-blur-xl z-[70] shadow-2xl transition-transform duration-500 ease-in-out transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        
        {/* CABECERA */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            <h2 className="text-lg font-bold uppercase tracking-widest">Tu Carrito ({totalItems})</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black hover:text-white transition-colors rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* LISTA DE PRODUCTOS */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 h-[calc(100vh-250px)]">
          {cart.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-sm italic">Tu carrito está vacío.</p>
            </div>
          ) : (
            cart.map((item, index) => (
              <div key={`${item.id}-${item.color}-${index}`} className="flex gap-4 group">
                <div className="relative w-20 h-24 bg-gray-100 overflow-hidden rounded-md">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold uppercase leading-tight">{item.name}</h3>
                    <p className="text-[10px] text-gray-500 uppercase mt-1">Color: <span className="font-bold text-black">{item.color}</span></p>
                    <p className="text-[10px] text-gray-400 mt-0.5 italic">Pack/Curva Mayorista</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-medium">${item.price.toFixed(2)}</span>
                    <button 
                      onClick={() => removeFromCart(item.id, item.color)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* PIE DE PÁGINA (SUBTOTAL Y BOTÓN) */}
        <div className="absolute bottom-0 left-0 w-full p-6 bg-white border-t border-gray-100">
          <div className="flex justify-between mb-4">
            <span className="text-gray-500 uppercase text-xs tracking-widest font-bold">Subtotal</span>
            <span className="text-xl font-bold">${subtotal.toFixed(2)}</span>
          </div>
          <button className="w-full bg-black text-white py-4 uppercase text-xs font-bold tracking-[0.2em] hover:bg-zinc-800 transition-colors">
            Finalizar Pedido
          </button>
        </div>
      </div>
    </>
  );
};
