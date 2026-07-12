import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ProductDetail } from "@/components/ProductDetail";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  const numericId = Number(id);
  if (Number.isNaN(numericId)) return null;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", numericId)
    .single();

  if (error || !data) return null;
  return data;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) return { title: "Producto no encontrado | KLH" };

  return {
    title: `${product.name} | KLH`,
    description: product.description ?? "Prenda KLH diseñada para moda mayorista.",
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  return <ProductDetail product={product} />;
}