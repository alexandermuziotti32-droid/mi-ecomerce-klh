"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import type { Product, ColorVariant } from "@/types";

export const ProductDetail = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();

  const colors = (product.colors as ColorVariant[] | null) ?? [];
  const images = product.images ?? [];
  const price = product.price ?? 0;

  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(
    colors[0]?.name ?? null
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
  }, [selectedSize]);

  const currentSizes =
    colors.find((c) => c.name === selectedColor)?.sizes ?? [];

  const handleAdd = () => {
    if (!selectedColor) {
      alert("Por favor selecciona un color");
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price,
      image: images[0] ?? "/placeholder.jpg",
      color: selectedColor,
      size: selectedSize ?? undefined,
      quantity,
    });

    const mensaje = selectedSize
      ? `Añadido: ${quantity} unid. Talle ${selectedSize} (${selectedColor})`
      : `Añadido: ${quantity} Curva(s) completa(s) (${selectedColor})`;

    alert(mensaje);
  };

  return (
    <main className="max-w-7xl mx-auto px-8 py-20">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        {/* COLUMNA IZQUIERDA: GALERÍA */}
        <div className="md:col-span-7 flex gap-4">
          <div className="flex flex-col gap-4 w-20">
            {images.map((img, index) => (
              <div
                key={index}
                onClick={() => setSelectedImg(index)}
                className={`relative aspect-[3/4] cursor-pointer border-2 transition-all duration-300 ${
                  selectedImg === index ? "border-black" : "border-transparent opacity-50"
                }`}
              >
                <Image
                  src={img}
                  alt={`${product.name} miniatura ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div className="flex-1 relative aspect-[3/4] bg-gray-50 overflow-hidden">
            {images[selectedImg] && (
              <Image
                src={images[selectedImg]}
                alt={product.name}
                fill
                className="object-cover transition-opacity duration-500"
                priority
              />
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: INFORMACIÓN */}
        <div className="md:col-span-5 flex flex-col gap-8">
          <div>
            <h1 className="text-4xl font-bold uppercase tracking-tighter leading-none mb-2">
              {product.name}
            </h1>
            <p className="text-2xl font-light text-gray-500">${price.toFixed(2)}</p>
          </div>

          <div className="border border-gray-200 rounded-sm">
            <div className="grid grid-cols-4 bg-gray-50 text-[9px] font-bold uppercase p-2 border-b">
              <span>Talle</span>
              <span>S</span>
              <span>M</span>
              <span>L</span>
            </div>
            <div className="grid grid-cols-4 text-[10px] p-2 border-b">
              <span className="font-bold">Ancho</span>
              <span>37cm</span>
              <span>39cm</span>
              <span>40cm</span>
            </div>
            <div className="grid grid-cols-4 text-[10px] p-2">
              <span className="font-bold">Largo</span>
              <span>48cm</span>
              <span>49cm</span>
              <span>50cm</span>
            </div>
          </div>

          <div className="py-4 border-t border-b">
            <p className="text-gray-600 leading-relaxed text-sm">
              {product.description || "Prenda KLH diseñada para moda mayorista."}
            </p>
          </div>

          {/* SELECTOR DE COLORES */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Colores
            </span>
            <div className="flex gap-4">
              {colors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedColor(color.name);
                    setSelectedSize(null);
                  }}
                  style={{ backgroundColor: color.hex }}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColor === color.name ? "border-black scale-110" : "border-gray-100"
                  }`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* SELECTOR DE TALLES */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Talle (Opcional)
              </span>
              {selectedSize && (
                <button
                  onClick={() => setSelectedSize(null)}
                  className="text-[9px] underline text-gray-400 uppercase"
                >
                  Borrar Selección
                </button>
              )}
            </div>
            <div className="flex gap-3">
              {currentSizes.map((item) => (
                <button
                  key={item.size}
                  disabled={item.stock === 0}
                  onClick={() => setSelectedSize(item.size)}
                  className={`w-12 h-12 rounded-full border flex items-center justify-center text-xs font-medium transition-all relative
                    ${item.stock === 0 ? "opacity-20 cursor-not-allowed bg-gray-100" : "hover:border-black"}
                    ${selectedSize === item.size ? "bg-black text-white border-black" : "border-gray-200 text-gray-900"}
                  `}
                >
                  {item.size}
                  {item.stock === 0 && (
                    <span className="absolute w-6 h-[1px] bg-black rotate-45"></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* CANTIDAD Y BOTÓN DE ACCIÓN */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Cantidad
            </span>
            <div className="flex gap-4 items-center">
              <div className="flex items-center border border-gray-200 h-[55px]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-5 h-full hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-10 text-center text-sm font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-5 h-full hover:bg-gray-50"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdd}
                className="flex-1 bg-black text-white h-[55px] uppercase font-bold tracking-[0.2em] text-[10px] hover:bg-zinc-800 transition-all active:scale-95"
              >
                {selectedSize ? `Añadir ${quantity} Unidades` : `Añadir ${quantity} Curvas`}
              </button>
            </div>
            <p className="text-[9px] text-gray-400 italic text-center">
              {selectedSize ? "* Venta por unidad seleccionada." : "* Venta por pack completo (Curva)."}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};