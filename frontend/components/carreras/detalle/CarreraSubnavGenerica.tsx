"use client";

import AnclaSuave from "./AnclaSuave";

// Subnav sticky para las carreras sin contenido enriquecido propio, igual
// que el de Gastronomía (CarreraSubnav) pero con solo las secciones que
// esta página realmente tiene.
export default function CarreraSubnavGenerica({ tieneGaleria }: { tieneGaleria: boolean }) {
  const secciones = [
    { id: "malla-curricular", label: "Malla curricular" },
    ...(tieneGaleria ? [{ id: "galeria", label: "Galería" }] : []),
  ];

  return (
    <div className="sticky top-[64px] sm:top-[76px] z-30 bg-white/95 backdrop-blur-sm border-b border-[var(--color-linea)]">
      <nav className="max-w-6xl mx-auto px-6 flex gap-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {secciones.map((s) => (
          <AnclaSuave
            key={s.id}
            href={`#${s.id}`}
            className="flex-shrink-0 px-4 py-3 text-sm font-semibold text-[var(--color-tinta)]/70 hover:text-[var(--color-naranja)] transition-colors"
          >
            {s.label}
          </AnclaSuave>
        ))}
      </nav>
    </div>
  );
}
