"use client";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import type { Product, ColorVariant } from "@/types";

export const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();

  // El campo colors viene como Json desde Supabase; confiamos en la forma
  // real del dato (confirmada por el usuario) al castear a ColorVariant[].
  const colors = (product.colors as ColorVariant[] | null) ?? [];
  const thumbnail = product.images?.[0] ?? "/placeholder.jpg";
  const price = product.price ?? 0;

  // Regla de negocio: una curva solo está disponible si TODOS sus talles
  // tienen stock > 0 (curva completa). Ajustar si el negocio permite
  // vender curvas parciales.
  const isCurveAvailable = (color: ColorVariant) =>
    color.sizes.length > 0 && color.sizes.every((s) => s.stock > 0);

  const handleAddCurve = (color: ColorVariant) => {
    if (!isCurveAvailable(color)) return;

    addToCart({
      id: product.id,
      name: product.name,
      price,
      image: thumbnail,
      color: color.name,
      quantity: 1,
    });
  };

  return (
    <div className="group cursor-pointer flex flex-col gap-3 relative">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
          <Image
            src={thumbnail}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-col gap-1 px-1 mt-2">
          <h3 className="text-sm font-medium uppercase tracking-tight text-gray-900">
            {product.name}
          </h3>
          <span className="text-sm font-bold">${price.toFixed(2)}</span>
        </div>
      </Link>

      {colors.length > 0 && (
        <div className="absolute bottom-[85px] left-0 right-0 px-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 z-20">
          <div className="bg-white/40 backdrop-blur-md p-3 shadow-xl border border-white/20 rounded-xl">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-center mb-3 text-black/60">
              Añadir Curva
            </p>
            <div className="flex justify-center gap-3">
              {colors.map((color, index) => {
                const available = isCurveAvailable(color);

                return (
                  <div key={`${color.name}-${index}`} className="relative group/color">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddCurve(color);
                      }}
                      disabled={!available}
                      style={{ backgroundColor: color.hex }}
                      className={`w-6 h-6 rounded-full border border-white/40 transition-all shadow-sm ${
                        available ? "hover:scale-125" : "opacity-30 cursor-not-allowed"
                      }`}
                    />
                    <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover/color:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-30 shadow-lg font-medium">
                      {color.name}
                      {!available ? " (sin stock)" : ""}
                      <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black"></span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};