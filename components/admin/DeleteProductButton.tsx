"use client";
import { useTransition } from "react";
import { deleteProduct } from "@/app/admin/products/actions";

export const DeleteProductButton = ({ productId }: { productId: number }) => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("¿Eliminar este producto? Esta acción no se puede deshacer.")) return;
    startTransition(() => {
      deleteProduct(productId);
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="px-4 text-[10px] font-bold uppercase tracking-widest border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
    >
      {isPending ? "..." : "Eliminar"}
    </button>
  );
};