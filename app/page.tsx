import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { Products } from "@/lib/data";

export default function Home() {
  return (
    <main>
      <Hero />
     {/* SECCIÓN DEL CATÁLOGO */}
      <section className="px-8 py-16 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-10 uppercase tracking-widest text-center">
          Novedades
        </h2>

        {/* 2. Aquí usamos el .map() dentro de un Grid de Tailwind */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {Products.map((product) => (
            // Por cada 'item' en el array PRODUCTS, dibujamos una ProductCard
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    
    </main>
  );
}
