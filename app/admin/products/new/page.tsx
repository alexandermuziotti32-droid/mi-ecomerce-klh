import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminNav } from "@/components/admin/AdminNav";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/");

  return (
    <div className="max-w-4xl mx-auto p-8 lg:py-16">
      <AdminNav active="products" />
      <h1 className="text-3xl font-bold uppercase tracking-tighter mb-10">Nuevo Producto</h1>
      <ProductForm />
    </div>
  );
}