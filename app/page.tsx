import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/lib/supabase";
import { ProductGrid } from "@/components/ProductGrid";

interface HomeProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  // Extraemos el término de búsqueda de la URL
  const { search } = await searchParams;

  // Construimos la query de Supabase
  let query = supabase.from('products').select('*');

  // Si hay una búsqueda, aplicamos el filtro
  if (search) {
    query = query.ilike('name', `%${search}%`); // Cambié 'id' por 'name'
  }

  const { data: products, error } = await query;

  if (error) {
    console.error("Error cargando productos:", error);
    return <div>Error al cargar la tienda</div>;
  }

  return (
    <main>
      <Hero />
      <section className="px-8 py-16 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-10 uppercase tracking-widest text-center">
          {search ? `Resultados para: "${search}"` : "Novedades"}
        </h2>
        
        {products && products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 italic">No hay productos que coincidan con tu búsqueda.</p>
          </div>
        )}
      </section>
    </main>
  );
}
