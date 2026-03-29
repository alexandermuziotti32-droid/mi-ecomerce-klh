import { Products } from "@/lib/data"; // Asegúrate de que el nombre coincida (PRODUCTS o Products)
import Image from "next/image";
import { notFound } from "next/navigation";

// 1. Añadimos "async" aquí
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  
  // 2. "Esperamos" a que los params estén listos
  const { id } = await params;

  // 3. Buscamos el producto (Usa Number o parseInt)
  const product = Products.find((p) => p.id === Number(id));

  if (!product) {
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto px-8 py-20">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 item-start">
        <div className="md:col-span-7 relative aspect-square bg-gray-50 overflow-hidden">
          <Image 
            src={product.image} 
            alt={product.name} 
            fill 
            className="object-cover"
            priority
          />
        </div>

        <div className="md:col-span-5 flex flex-col gap-6">
          <h1 className="text-4xl font-bold uppercase leading-tight">{product.name}</h1>
          <p className="text-2xl font-light text-gray-800">${product.price.toFixed(2)}</p>
          
          <div className="border-t border-b py-6 my-2">
            <p className="text-gray-600 leading-relaxed">
              {product.description || "Esta prenda premium KLH está diseñada para ofrecer máxima comodidad y estilo minimalista."}
            </p>
          </div>

          {/* Selector de tallas */}
          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase font-bold tracking-widest">Seleccionar Talla</span>
            <div className="flex gap-3">
              {['S', 'M', 'L', 'XL'].map((talla) => (
                <button key={talla} className="w-12 h-12 border border-gray-200 flex items-center justify-center text-sm hover:border-black transition-colors">
                  {talla}
                </button>
              ))}
            </div>
          </div>

          <button className="w-full bg-black text-white py-4 mt-4 hover:bg-gray-900 transition-colors uppercase font-bold tracking-widest text-sm">
            Añadir al carrito
          </button>
        </div>
      </div>
    </main>
  );
}
