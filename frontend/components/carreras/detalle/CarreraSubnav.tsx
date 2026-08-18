"use client";

import AnclaSuave from "./AnclaSuave";

const SECCIONES = [
  { id: "descripcion", label: "Descripción" },
  { id: "plan-estudios", label: "Plan de estudios" },
  { id: "perfil-egreso", label: "Perfil de egreso" },
  { id: "campo-laboral", label: "Campo laboral" },
  { id: "galeria", label: "Galería" },
  { id: "preguntas-frecuentes", label: "Preguntas frecuentes" },
];

export default function CarreraSubnav() {
  return (
    <div className="sticky top-[64px] sm:top-[76px] z-30 bg-white/95 backdrop-blur-sm border-b border-[var(--color-linea)]">
      <nav className="max-w-6xl mx-auto px-6 flex gap-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {SECCIONES.map((s) => (
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
