
"use client";
import Image from "next/image";
import Link from "next/link";

interface ProductProps {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    description: string;
  };
}

export const ProductCard = ({ product }: ProductProps) => {
  return (
    <div className="group cursor-pointer flex flex-col gap-3 relative">
      <Link href={`/product/${product.id}`} className="block">
        {/* CONTENEDOR DE IMAGEN: Más limpio y alto */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* DETALLES DEL PRODUCTO: Alineados a la izquierda */}
        <div className="flex flex-col gap-1 px-1">
          <h3 className="text-sm font-medium uppercase tracking-tight text-gray-900">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-1">
            {product.description}
          </p>
          <span className="text-sm font-bold mt-1">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </Link>

      {/* BOTÓN RÁPIDO (Opcional): Aparece solo al pasar el mouse */}
      <div className="absolute bottom-[85px] left-4 right-4 translate-y-10 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 z-10">
        
        <button
        onClick={(e)=>{
          e.preventDefault();
          alert(`Añadido: ${product.name}`);
        }}
        className="w-full bg-white/90 py-2 text-xs font-bold uppercase backdrop-blur-sm hover:bg-black hover:text-white transition-colors">
          
          Añadir al carrito
        </button>
      </div>
    </div>
  );
};
