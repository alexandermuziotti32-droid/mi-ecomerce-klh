import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ProductGrid } from "@/components/ProductGrid";
import type { Metadata } from "next";

const VALID_CATEGORIES = ["hombres", "mujeres", "accesorios"] as const;
type Category = (typeof VALID_CATEGORIES)[number];

const CATEGORY_LABELS: Record<Category, string> = {
  hombres: "Hombres",
  mujeres: "Mujeres",
  accesorios: "Accesorios",
};

function isValidCategory(value: string): value is Category {
  return (VALID_CATEGORIES as readonly string[]).includes(value);
}

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  if (!isValidCategory(category)) return {};
  return { title: `${CATEGORY_LABELS[category]} | KLH` };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  if (!isValidCategory(category)) notFound();

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .order("id", { ascending: false });

  if (error) {
    console.error("Error cargando categoría:", error);
    return (
      <div className="py-20 text-center">
        Error al conectar con la base de datos
      </div>
    );
  }

  return (
    <main className="px-8 py-16 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-10 uppercase tracking-widest text-center">
        {CATEGORY_LABELS[category]}
      </h1>

      {products && products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="text-center py-20 text-gray-500 italic">
          Todavía no hay productos en esta categoría.
        </div>
      )}
    </main>
  );
}
