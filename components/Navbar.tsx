"use client";
import { useState } from "react";
// importar la libreria de los iconos
import { ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { CartDrawer } from "./CartDrawer";
import { SearchBar } from "./SearchBar";

export const Navbar = () => {
    const { totalItems } = useCart();
    const [isCartOpen, setIsCartOpen] = useState(false);

    return (
      <>
        <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white sticky top-0 z-50">
      
          {/* SECCIÓN 1: El Logo (Izquierda) */}
          <div className="text-2xl font-bold tracking-tighter">
            <Link href="/">KLH</Link>
          </div>

          {/* SECCIÓN 2: Menú de Navegación (Centro) */}
          <div className="hidden md:flex space-x-6 text-sm uppercase font-medium">
            <ul className="flex gap-6">
                <li className="hover:underline"><Link href="/hombres">Hombres</Link></li>
                <li className="hover:underline"><Link href="/mujeres">Mujeres</Link></li>
                <li className="hover:underline"><Link href="/accesorios">Accesorios</Link></li>
                <li className="hover:underline"><Link href="/Ver_Todo">Ver Todo</Link></li>
            </ul>
          </div>

          {/* SECCIÓN 3: Iconos de Acción (Derecha) - UNIFICADO */}
          <div className="flex items-center space-x-5">
            <SearchBar/>
            <User className="w-5 h-5 cursor-pointer hover:text-gray-500" />
            
            {/* Contenedor del Carrito con clic para abrir */}
            <div 
                onClick={() => setIsCartOpen(true)}
                className="relative cursor-pointer group"
            >
              <ShoppingCart className="w-5 h-5 group-hover:text-gray-500 transition-colors" />
              
              {/* Burbuja del contador (solo se ve si hay items) */}
              <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-medium text-white">
                {totalItems}
              </span> 
            </div>
          </div>

        </nav>

        {/* El Panel que sale de la derecha */}
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </>
    );
};
