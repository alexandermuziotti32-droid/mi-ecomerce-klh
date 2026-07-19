import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <main className="max-w-2xl mx-auto px-8 py-20">
      <h1 className="text-3xl font-bold uppercase tracking-tighter mb-2">Mi Cuenta</h1>
      <p className="text-gray-400 text-sm mb-10">{user.email}</p>

      <div className="flex flex-col gap-4">
        <Link
          href="/account/orders"
          className="border border-gray-200 rounded-lg p-6 hover:border-black transition-colors"
        >
          <h2 className="font-bold uppercase text-sm tracking-widest mb-1">Mis Pedidos</h2>
          <p className="text-gray-400 text-sm">Ver historial de compras</p>
        </Link>

        <LogoutButton />
      </div>
    </main>
  );
}