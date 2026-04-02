"use client";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { useState, useEffect } from "react";

// --- INTERFACES PARA TYPESCRIPT ---
interface SizesStock {
  size: string;
  stock: number;
}

interface ColorOption {
  name: string;
  hex: string;
  sizes: SizesStock[]; 
}

interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
  description: string;
  colors: ColorOption[];
}

export default function ProductPage() {
  const params = useParams();
  const id = params?.id;
  const { addToCart } = useCart();

  // --- ESTADOS ---
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // 1. CARGAR DATOS DE SUPABASE
  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("Error:", error);
      } else {
        setProduct(data);
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0].name);
        }
      }
      setLoading(false);
    };

    if (id) fetchProduct();
  }, [id]);

  // Resetear cantidad al cambiar de talle o producto
  useEffect(() => {
    setQuantity(1);
  }, [selectedSize, id]);

  // Filtrar talles según el color elegido
  const currentSizes = product?.colors.find(c => c.name === selectedColor)?.sizes || [];

  if (loading) return (
    <div className="h-screen flex items-center justify-center uppercase tracking-[0.3em] text-[10px] animate-pulse">
      KLH / Cargando Prenda...
    </div>
  );

  if (!product) return notFound();

  // 2. FUNCIÓN AÑADIR AL CARRITO
  const handleAdd = () => {
    if (!selectedColor) return alert("Por favor selecciona un color");

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      color: selectedColor,
      size: selectedSize || undefined, // Si es null, el carrito lo trata como "Curva"
      quantity: quantity,
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
            {product.images?.map((img, index) => (
              <div
                key={index}
                onClick={() => setSelectedImg(index)}
                className={`relative aspect-[3/4] cursor-pointer border-2 transition-all duration-300 ${
                  selectedImg === index ? "border-black" : "border-transparent opacity-50"
                }`}
              >
                <Image src={img} alt="thumb" fill className="object-cover" />
              </div>
            ))}
          </div>

          <div className="flex-1 relative aspect-[3/4] bg-gray-50 overflow-hidden">
            <Image
              src={product.images[selectedImg]}
              alt={product.name}
              fill
              className="object-cover transition-opacity duration-500"
              priority
            />
          </div>
        </div>

        {/* COLUMNA DERECHA: INFORMACIÓN */}
        <div className="md:col-span-5 flex flex-col gap-8">
          <div>
            <h1 className="text-4xl font-bold uppercase tracking-tighter leading-none mb-2">
              {product.name}
            </h1>
            <p className="text-2xl font-light text-gray-500">${product.price.toFixed(2)}</p>
          </div>

          {/* TABLA DE MEDIDAS */}
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
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Colores</span>
            <div className="flex gap-4">
              {product.colors?.map((color, index) => (
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
               <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Talle (Opcional)</span>
               {selectedSize && (
                 <button onClick={() => setSelectedSize(null)} className="text-[9px] underline text-gray-400 uppercase">Borrar Selección</button>
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
                  {item.stock === 0 && <span className="absolute w-6 h-[1px] bg-black rotate-45"></span>}
                </button>
              ))}
            </div>
          </div>

          {/* CANTIDAD Y BOTÓN DE ACCIÓN */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Cantidad</span>
            <div className="flex gap-4 items-center">
              <div className="flex items-center border border-gray-200 h-[55px]">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-5 h-full hover:bg-gray-50">-</button>
                <span className="w-10 text-center text-sm font-bold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-5 h-full hover:bg-gray-50">+</button>
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
}
