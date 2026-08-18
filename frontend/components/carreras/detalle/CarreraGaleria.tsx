import Image from "next/image";
import type { CarreraContenidoDetallado } from "@/lib/carrerasContenido";

export default function CarreraGaleria({ contenido }: { contenido: CarreraContenidoDetallado }) {
  if (contenido.galeria.length === 0) return null;

  return (
    <section id="galeria" className="bg-[var(--color-fondo)] py-16 sm:py-20 scroll-mt-28">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-titulo text-3xl md:text-4xl font-bold text-[var(--color-verde-oscuro)] text-center">
          Vive la experiencia gastronómica
        </h2>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {contenido.galeria.map((img) => (
            <div key={img.src} className="group relative rounded-2xl overflow-hidden shadow-sm aspect-[4/3]">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 640px) 46vw, 90vw"
                className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                unoptimized
              />
              <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 ease-out group-hover:bg-black/25" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
