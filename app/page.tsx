// app/page.tsx
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { supabase } from "@/lib/supabase";

// IMPORTANTE: En Next.js 15, searchParams es una Promesa
interface HomeProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  // 1. Esperamos los parámetros de búsqueda
  const params = await searchParams;
  const searchTerm = params.search;

  // 2. Hacemos la consulta a Supabase
  let query = supabase.from('products').select('*');

  if (searchTerm) {
    // Ajusta 'name' al nombre real de tu columna en Supabase
    query = query.ilike('name', `%${searchTerm}%`);
  }

  const { data: products, error } = await query;

  if (error) {
    console.error("Error cargando productos:", error);
    return <div className="py-20 text-center">Error al conectar con la base de datos</div>;
  }

  return (
    <main>
      <Hero />
      <section className="px-8 py-16 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-10 uppercase tracking-widest text-center">
          {searchTerm ? `Resultados para: "${searchTerm}"` : "Novedades"}
        </h2>
        
        {/* Usamos el ProductGrid que creamos para las animaciones */}
        {products && products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="text-center py-20 text-gray-500 italic">
            No se encontraron productos.
          </div>
        )}
      </section>
    </main>
  );
}
