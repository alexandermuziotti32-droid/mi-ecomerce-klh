"use client"; // 1. Marcamos como cliente para usar hooks
import { Products } from "@/lib/data";
import Image from "next/image";
import { notFound, useParams } from "next/navigation"; // 2. Usamos useParams en lugar de props async
import { useState } from "react";

export default function ProductPage() {
  // 3. Obtenemos el ID de la URL de forma sincronizada para el cliente
  const params = useParams();
  const id = params?.id;

  // 4. Estado para la galería
  const [selectedImg, setSelectedImg] = useState(0);

  // 5. Buscamos el producto
  const product = Products.find((p) => p.id === Number(id));

  if (!product) {
    return notFound();
  }

  // 6. Aseguramos que 'images' exista, si no, usamos la principal en un array
  const images: string[] = Array.isArray(product.image) ? product.image : [product.image];
  return (
    <main className="max-w-7xl mx-auto px-8 py-20">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* COLUMNA DE GALERÍA (7/12) */}
        <div className="md:col-span-7 flex gap-4">
          
          {/* Miniaturas */}
          <div className="flex flex-col gap-4 w-20">
            {images.map((img, index) => (
              <div 
                key={index}
                onClick={() => setSelectedImg(index)}
                className={`relative aspect-[3/4] cursor-pointer border-2 transition-all duration-300 ${
                  selectedImg === index ? 'border-black opacity-100' : 'border-transparent opacity-50'
                }`}
              >
                <Image src={img} alt={`thumb-${index}`} fill className="object-cover" />
              </div>
            ))}
          </div>

          {/* Imagen Principal */}
          <div className="flex-1 relative aspect-[3/4] bg-gray-50 overflow-hidden">
            <Image 
              src={images[selectedImg]} 
              alt={product.name} 
              fill 
              className="object-cover transition-all duration-500"
              priority
            />
          </div>
        </div>

        {/* COLUMNA DE INFO (5/12) */}
        <div className="md:col-span-5 flex flex-col gap-6">
          <h1 className="text-4xl font-bold uppercase leading-tight">{product.name}</h1>
          <p className="text-2xl font-light text-gray-800">${product.price.toFixed(2)}</p>

          <div className="border-t border-b py-6 my-2">
            <p className="text-gray-600 leading-relaxed text-sm">
              {product.description || "Prenda de alta calidad diseñada con los mejores materiales."}
            </p>
          </div>

          {/* Selector de tallas */}
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase font-bold tracking-widest text-gray-400">Seleccionar Talla</span>
            <div className="flex gap-3">
              {["S", "M", "L", "XL"].map((talla) => (
                <button
                  key={talla}
                  className="w-12 h-12 border border-gray-200 flex items-center justify-center text-xs hover:border-black transition-colors uppercase font-medium"
                >
                  {talla}
                </button>
              ))}
            </div>
          </div>

          <button className="w-full bg-black text-white py-4 mt-4 hover:bg-zinc-800 transition-colors uppercase font-bold tracking-widest text-xs">
            Añadir al carrito
          </button>
        </div>
      </div>
    </main>
  );
}
