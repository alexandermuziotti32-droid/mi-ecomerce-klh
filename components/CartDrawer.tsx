"use client";
import { useCart } from "@/context/CartContext";
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";

export const CartDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { cart, removeFromCart, addToCart, totalItems } = useCart();

  // Calcular el subtotal
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Función para ajustar cantidad desde el Drawer
  const updateQuantity = (item: any, amount: number) => {
    const newQuantity = item.quantity + amount;
    if (newQuantity > 0) {
      // Usamos la misma función addToCart pero con cantidad relativa
      addToCart({ ...item, quantity: amount });
    }
  };

  return (
    <>
      {/* Fondo oscuro con Blur */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Panel Lateral con Blur y Transparencia */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white/90 backdrop-blur-2xl z-[70] shadow-2xl transition-transform duration-500 ease-in-out transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        
        {/* CABECERA */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100/50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            <h2 className="text-sm font-bold uppercase tracking-[0.2em]">Tu Pedido ({totalItems})</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black hover:text-white transition-all rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* LISTA DE PRODUCTOS */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 h-[calc(100vh-260px)]">
          {cart.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-[10px] uppercase tracking-widest italic">El carrito está vacío</p>
            </div>
          ) : (
            cart.map((item, index) => (
              <div key={`${item.id}-${item.color}-${item.size}-${index}`} className="flex gap-4 group animate-in fade-in slide-in-from-right-5">
                {/* Imagen del producto */}
                <div className="relative w-20 h-28 bg-gray-100 overflow-hidden rounded-sm flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>

                {/* Detalles e Info */}
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-[11px] font-bold uppercase leading-tight w-40">{item.name}</h3>
                      <span className="text-xs font-bold">${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                    
                    {/* Etiquetas dinámicas: Talle vs Curva */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-[9px] px-2 py-0.5 bg-gray-100 font-bold uppercase">Color: {item.color}</span>
                      <span className={`text-[9px] px-2 py-0.5 font-bold uppercase ${
                        item.size ? 'bg-black text-white' : 'bg-zinc-700 text-white'
                      }`}>
                        {item.size ? `Talle: ${item.size}` : "Pack / Curva Completa"}
                      </span>
                    </div>
                  </div>

                  {/* Controles de Cantidad y Borrar */}
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center border border-gray-200 bg-white">
                      <button 
                        onClick={() => updateQuantity(item, -1)}
                        className="p-1.5 hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-[10px] font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item, 1)}
                        className="p-1.5 hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.id, item.color, item.size)}
                      className="text-gray-300 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* PIE DE PÁGINA: SUBTOTAL Y CHECKOUT */}
        <div className="absolute bottom-0 left-0 w-full p-6 bg-white/95 border-t border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-400 uppercase text-[10px] tracking-[0.2em] font-bold">Subtotal</span>
            <span className="text-xl font-bold">${subtotal.toLocaleString()}</span>
          </div>
          <button className="w-full bg-black text-white py-4 uppercase text-[10px] font-bold tracking-[0.3em] hover:bg-zinc-800 transition-all active:scale-[0.98]">
            Finalizar Pedido
          </button>
          <p className="text-[9px] text-center text-gray-400 mt-3 italic">
            Pedido mayorista sujeto a disponibilidad de stock.
          </p>
        </div>
      </div>
    </>
  );
};
