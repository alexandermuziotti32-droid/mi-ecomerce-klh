import Link from "next/link";

export const AdminNav = ({ active }: { active: "orders" | "products" }) => {
  return (
    <div className="flex gap-6 border-b border-gray-100 mb-10">
      <Link
        href="/admin"
        className={`pb-3 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-colors ${
          active === "orders" ? "border-black text-black" : "border-transparent text-gray-400 hover:text-black"
        }`}
      >
        Pedidos
      </Link>
      <Link
        href="/admin/products"
        className={`pb-3 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-colors ${
          active === "products" ? "border-black text-black" : "border-transparent text-gray-400 hover:text-black"
        }`}
      >
        Productos
      </Link>
    </div>
  );
};