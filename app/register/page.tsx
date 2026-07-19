"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    setIsLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    router.push("/account");
    router.refresh();
  };

  return (
    <div className="max-w-sm mx-auto py-24 px-6">
      <h1 className="text-2xl font-bold uppercase tracking-tighter mb-8 text-center">
        Crear Cuenta
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">
            Email
          </label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-b border-gray-200 py-3 outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">
            Contraseña
          </label>
          <input
            required
            type="password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-b border-gray-200 py-3 outline-none focus:border-black"
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white py-4 uppercase text-sm font-bold tracking-widest hover:bg-zinc-800 transition-all disabled:opacity-50"
        >
          {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
        </button>
        <p className="text-center text-xs text-gray-400">
          ¿Ya tenés cuenta?{" "}
          <a href="/login" className="underline text-black">
            Iniciar sesión
          </a>
        </p>
      </form>
    </div>
  );
}
