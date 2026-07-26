import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminNav } from "@/components/admin/AdminNav";
import { ProductForm } from "@/components/admin/ProductForm";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/");

  const { id } = await params;
  const numericId = Number(id);
  if (Number.isNaN(numericId)) notFound();

  const { data: product } = await supabase.from("products").select("*").eq("id", numericId).single();
  if (!product) notFound();

  return (
    <div className="max-w-4xl mx-auto p-8 lg:py-16">
      <AdminNav active="products" />
      <h1 className="text-3xl font-bold uppercase tracking-tighter mb-10">Editar Producto</h1>
      <ProductForm product={product} />
    </div>
  );
}