"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "@/components/ui/Lightbox";
import type { FotoCarrera } from "@/lib/carrerasGenericas";

// Galería de fotos reales (subidas desde /admin/galeria) para las carreras
// que aún no tienen contenido enriquecido propio. Ver lib/carrerasGenericas.ts.
// Cada foto se puede tocar para verla ampliada (Lightbox).
export default function CarreraGaleriaGenerica({ fotos }: { fotos: FotoCarrera[] }) {
  const [indiceAbierto, setIndiceAbierto] = useState<number | null>(null);

  if (fotos.length === 0) return null;

  return (
    <section id="galeria" className="bg-[var(--color-fondo)] py-16 sm:py-20 scroll-mt-28">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-titulo text-3xl md:text-4xl font-bold text-[var(--color-verde-oscuro)] text-center">
          Momentos de la carrera
        </h2>
        <p className="mt-3 text-[var(--color-tinta)]/70 text-center">Toca una foto para verla en grande.</p>

        <div
          className={`mt-12 grid grid-cols-1 gap-5 ${
            fotos.length >= 2 ? "sm:grid-cols-2" : "sm:max-w-lg sm:mx-auto"
          }`}
        >
          {fotos.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setIndiceAbierto(i)}
              className="group relative rounded-2xl overflow-hidden shadow-sm aspect-[4/3] text-left cursor-zoom-in"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 640px) 46vw, 90vw"
                className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                unoptimized
              />
              <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 ease-out group-hover:bg-black/25" />
            </button>
          ))}
        </div>
      </div>

      {indiceAbierto !== null && (
        <Lightbox
          fotos={fotos}
          indice={indiceAbierto}
          onCerrar={() => setIndiceAbierto(null)}
          onCambiarIndice={setIndiceAbierto}
        />
      )}
    </section>
  );
}
