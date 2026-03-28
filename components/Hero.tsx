import Image from "next/image";
import Link from "next/link";

export const Hero = () => {
  return (
    <section className="flex flex-col md:flex-row h-[80vh] w-full bg-gray-50">
      {/* LADO IZQUIERDO: Texto y Botón */}
      <div className="flex-1 flex flex-col justify-center items-start px-12 lg:px-24 space-y-6">
        <span className="text-sm uppercase tracking-widest text-gray-500">
          Nueva Temporada
        </span>
        <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
          ESTILO <br /> SIN LÍMITES
        </h1>
        {/* RETO: Crea aquí el botón negro con texto blanco */}
        <Link href="/collection">
          <button className="bg-black text-white py-2 px-6 hover:bg-gray-800 rounded-full">
            Ver Colección
          </button>
        </Link>
      </div>

      {/* LADO DERECHO: Imagen */}
      <div className="flex-1 relative overflow-hidden">
        <Image
          src="/images/hero-image.webp"
          alt="imagen-prueba"
          className="h-full w-full object-cover"
          fill
          priority
        />
      </div>
    </section>
  );
};
