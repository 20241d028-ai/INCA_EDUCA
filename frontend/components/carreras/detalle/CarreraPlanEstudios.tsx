"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { IconChevronDown, IconClock, IconCompass, IconFlag } from "@/components/ui/Icons";
import type { CarreraContenidoDetallado } from "@/lib/carrerasContenido";

export default function CarreraPlanEstudios({ contenido }: { contenido: CarreraContenidoDetallado }) {
  const [abierto, setAbierto] = useState<number | null>(0);
  const total = contenido.planEstudios.reduce((acc, m) => acc + m.duracionMeses, 0);

  return (
    <section id="plan-estudios" className="bg-white py-16 sm:py-20 scroll-mt-28">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="font-titulo text-3xl md:text-4xl font-bold text-[var(--color-verde-oscuro)] text-center">
          Plan de estudios
        </h2>
        <p className="mt-3 text-[var(--color-tinta)]/70 text-center max-w-xl mx-auto">
          {contenido.planEstudios.length} módulos de {contenido.planEstudios[0]?.duracionMeses ?? 3} meses cada
          uno — {total} meses en total.
        </p>

        {/* Timeline del recorrido de la carrera */}
        <div className="mt-14 mb-14">
          <div className="hidden md:flex items-start justify-between relative px-2">
            <div className="absolute top-5 left-[6%] right-[6%] h-0.5 bg-[var(--color-linea)]" aria-hidden="true" />

            <div className="relative z-10 flex flex-col items-center text-center w-20">
              <span className="w-10 h-10 rounded-full bg-white border-2 border-[var(--color-verde)] text-[var(--color-verde)] flex items-center justify-center shadow-sm">
                <IconCompass className="w-4 h-4" />
              </span>
              <span className="mt-2 text-xs font-bold text-[var(--color-tinta)]">Inicio</span>
            </div>

            {contenido.planEstudios.map((m) => (
              <div key={m.numero} className="relative z-10 flex flex-col items-center text-center w-20">
                <span className="w-10 h-10 rounded-full bg-[var(--color-naranja)] text-white font-titulo font-bold flex items-center justify-center shadow-sm">
                  {m.numero}
                </span>
                <span className="mt-2 text-xs font-bold text-[var(--color-tinta)]">Módulo {m.numero}</span>
                <span className="text-[11px] text-[var(--color-tinta)]/60">{m.duracionMeses} meses</span>
              </div>
            ))}

            <div className="relative z-10 flex flex-col items-center text-center w-20">
              <span className="w-10 h-10 rounded-full bg-white border-2 border-[var(--color-verde)] text-[var(--color-verde)] flex items-center justify-center shadow-sm">
                <IconFlag className="w-4 h-4" />
              </span>
              <span className="mt-2 text-xs font-bold text-[var(--color-tinta)]">Finalización</span>
              <span className="text-[11px] text-[var(--color-tinta)]/60">{total} meses</span>
            </div>
          </div>

          <div className="md:hidden flex flex-col">
            <EtapaMovil icono={<IconCompass className="w-4 h-4" />} label="Inicio" />
            {contenido.planEstudios.map((m) => (
              <EtapaMovil key={m.numero} numero={m.numero} label={`Módulo ${m.numero}`} sub={`${m.duracionMeses} meses`} />
            ))}
            <EtapaMovil icono={<IconFlag className="w-4 h-4" />} label="Finalización" sub={`${total} meses`} esUltimo />
          </div>
        </div>

        {/* Acordeón de módulos */}
        <div className="flex flex-col gap-3">
          {contenido.planEstudios.map((m, i) => {
            const estaAbierto = abierto === i;
            return (
              <div key={m.numero} className="rounded-2xl border border-[var(--color-linea)] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setAbierto(estaAbierto ? null : i)}
                  aria-expanded={estaAbierto}
                  className="w-full flex items-center gap-4 text-left px-5 py-4 sm:px-6 sm:py-5 bg-[var(--color-fondo)]"
                >
                  <span className="flex-shrink-0 w-11 h-11 rounded-full bg-[var(--color-verde)] text-white font-titulo font-bold flex items-center justify-center">
                    {m.numero}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-titulo font-bold text-[var(--color-verde-oscuro)]">
                      Módulo {m.numero}: {m.nombre}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-[var(--color-tinta)]/60 uppercase tracking-wide">
                      <IconClock className="w-3.5 h-3.5" />
                      {m.duracionMeses} meses · {m.cursos.length} cursos
                    </span>
                  </span>
                  <IconChevronDown
                    className={`w-5 h-5 flex-shrink-0 text-[var(--color-naranja)] transition-transform duration-300 ${
                      estaAbierto ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-all duration-300 ease-out ${
                    estaAbierto ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <ul className="px-5 pb-5 sm:px-6 sm:pb-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                      {m.cursos.map((curso, idx) => (
                        <li key={curso} className="flex items-start gap-2 text-sm text-[var(--color-tinta)]/80">
                          <span className="flex-shrink-0 mt-0.5 text-xs font-bold text-[var(--color-naranja)]">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <span>{curso}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function EtapaMovil({
  numero,
  icono,
  label,
  sub,
  esUltimo,
}: {
  numero?: number;
  icono?: ReactNode;
  label: string;
  sub?: string;
  esUltimo?: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--color-naranja)] text-white font-titulo font-bold flex items-center justify-center shadow-sm">
          {icono ?? numero}
        </div>
        {!esUltimo && <div className="w-0.5 flex-1 bg-[var(--color-linea)] my-1" />}
      </div>
      <div className={esUltimo ? "pb-1" : "pb-6"}>
        <p className="font-titulo font-bold text-sm text-[var(--color-tinta)]">{label}</p>
        {sub && <p className="text-xs text-[var(--color-tinta)]/60">{sub}</p>}
      </div>
    </div>
  );
}
