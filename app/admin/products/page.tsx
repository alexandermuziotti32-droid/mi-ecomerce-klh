import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminNav } from "@/components/admin/AdminNav";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/");

  const { data: products } = await supabase
    .from("products")
    .select("id, name, price, images")
    .order("id", { ascending: false });

  return (
    <div className="max-w-7xl mx-auto p-8 lg:py-16">
      <AdminNav active="products" />

      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold uppercase tracking-tighter">Productos</h1>
        <Link
          href="/admin/products/new"
          className="bg-black text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
        >
          + Nuevo Producto
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products?.map((product) => (
          <div key={product.id} className="border border-gray-100 rounded-xl overflow-hidden">
            <div className="relative aspect-[3/4] bg-gray-100">
              {product.images?.[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="p-4 space-y-3">
              <h3 className="font-bold text-sm uppercase truncate">{product.name}</h3>
              <p className="text-gray-500 text-sm">${(product.price ?? 0).toFixed(2)}</p>
              <div className="flex gap-2">
                <Link
                  href={`/admin/products/${product.id}`}
                  className="flex-1 text-center text-[10px] font-bold uppercase tracking-widest border border-gray-200 py-2 hover:border-black transition-colors"
                >
                  Editar
                </Link>
                <DeleteProductButton productId={product.id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}