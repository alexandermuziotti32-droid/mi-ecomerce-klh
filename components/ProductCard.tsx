"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

interface ColorOption {
  name: string;
  hex: string;
}

interface ProductProps {
  product: {
    id: number;
    name: string;
    price: number;
    images: string[]; // 1. CORRECCIÓN: 'images' en plural como en Supabase
    description: string;
    colors?: (string | ColorOption)[];
  };
}

export const ProductCard = ({ product }: ProductProps) => {
  const { addToCart } = useCart();

  const handleAddCurve = (colorName: string) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      // 2. CORRECCIÓN: Usamos images[0]
      image: product.images ? product.images[0] : "/placeholder.jpg",
      color: colorName,
      quantity: 1,
    });
  };

  return (
    <div className="group cursor-pointer flex flex-col gap-3 relative">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
          <Image
            // 3. CORRECCIÓN: Usamos images[0] con una validación por si acaso
            src={product.images ? product.images[0] : "/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-col gap-1 px-1 mt-2">
          <h3 className="text-sm font-medium uppercase tracking-tight text-gray-900">{product.name}</h3>
          <span className="text-sm font-bold">${product.price.toFixed(2)}</span>
        </div>
      </Link>

      {/* INTERFAZ DE SELECCIÓN DE COLOR CON BLUR */}
      <div className="absolute bottom-[85px] left-0 right-0 px-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 z-20">
        <div className="bg-white/40 backdrop-blur-md p-3 shadow-xl border border-white/20 rounded-xl">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-center mb-3 text-black/60">
            Añadir Curva
          </p>
          <div className="flex justify-center gap-3">
            {product.colors?.map((color, index) => {
              const colorHex = typeof color === 'string' ? color : color.hex;
              const colorName = typeof color === 'string' ? color : color.name;

              return (
                <div key={index} className="relative group/color">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddCurve(colorName);
                    }}
                    style={{ backgroundColor: colorHex }}
                    className="w-6 h-6 rounded-full border border-white/40 hover:scale-125 transition-all shadow-sm"
                  />
                  <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover/color:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-30 shadow-lg font-medium">
                    {colorName}
                    <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black"></span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
