"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export const LogoutButton = () => {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors underline"
    >
      Cerrar sesión
    </button>
  );
};
