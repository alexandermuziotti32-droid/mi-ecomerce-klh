// importar la libreria de los iconos
import { ShoppingCart, User, Search } from "lucide-react";
import Link from "next/link";

export const Navbar = () => {
    return (
        <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white sticky top-0 z-50">
      
      {/* SECCIÓN 1: El Logo (Izquierda) */}
      <div className="text-2xl font-bold tracking-tighter">
        <Link href="/">KLH</Link>
      </div>

      {/* SECCIÓN 2: Menú de Navegación (Centro) */}
      <div className="hidden md:flex space-x-6 text-sm uppercase font-medium">
         {
            <ul className="flex gap-6">

                <li className="hover:underline"><Link href="/hombres">Hombres</Link></li>
                <li className="hover:underline"><Link href="/mujeres">Mujeres</Link></li>
                <li className="hover:underline"><Link href="/accesorios">Accesorios</Link></li>
                <li className="hover:underline"><Link href="/Ver_Todo">Ver Todo</Link></li>
            </ul>
         }
      </div>

      {/* SECCIÓN 3: Iconos de Acción (Derecha) */}
      <div className="flex items-center space-x-5">
        <Search className="w-5 h-5 cursor-pointer hover:text-gray-500" />
        <User className="w-5 h-5 cursor-pointer" />
        <div className="relative cursor-pointer group">
          <ShoppingCart className="w-5 h-5 cursor-pointer" />
          {/* Tip: Aquí podrías poner un círculo pequeño con el número del carrito */}
          <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-medium text-white">0</span> 
        </div>
      </div>

    </nav>
  );
};
