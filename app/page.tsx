import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { Products } from "@/lib/data";
import { supabase } from "@/lib/supabase";

const { data: products, error } = await supabase.from('products').select('*');
console.log("Productos desde Supabase:", products); // Mira esto en la terminal de VS Code


export default async function Home() {
  // Traemos los datos de Supabase en tiempo real
  const { data: products, error } = await supabase
    .from('products')
    .select('*');

  if (error) {
    console.error("Error cargando productos:", error);
    return <div>Error al cargar la tienda</div>;
  }

  return (
    <main>
      <Hero />
      <section className="px-8 py-16 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-10 uppercase tracking-widest text-center">Novedades</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {products?.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </main>
  );
}