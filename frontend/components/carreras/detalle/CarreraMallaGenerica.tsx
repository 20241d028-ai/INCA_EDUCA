"use client";

import { useState } from "react";
import { IconChevronDown, IconChevronRight, IconClock, IconCompass, IconFlag } from "@/components/ui/Icons";
import { generarMallaPlaceholder } from "@/lib/mallas";
import FadeIn from "@/components/ui/FadeIn";

// Malla curricular / módulos para las carreras que aún no tienen un plan
// de estudios detallado cargado (ver lib/carrerasContenido.ts). Se muestran
// las etapas generales reales del proceso formativo de INCA EDUCA
// (lib/mallas.ts), calculadas a partir de la duración real de la carrera,
// como un acordeón interactivo (igual de interactivo que el plan de
// estudios de Gastronomía). No se inventan cursos ni nombres de módulos
// específicos de cada carrera: el detalle exacto se confirma con un asesor,
// tal como indica el aviso de esta sección.
export default function CarreraMallaGenerica({ duracionMeses }: { duracionMeses: number }) {
  const etapas = generarMallaPlaceholder(duracionMeses);
  const mesesPorEtapa = Math.round(duracionMeses / etapas.length);
  const [abierta, setAbierta] = useState<number | null>(0);

  return (
    <section id="malla-curricular" className="bg-white py-16 sm:py-20 scroll-mt-28">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="font-titulo text-3xl md:text-4xl font-bold text-[var(--color-verde-oscuro)] text-center">
          Malla curricular
        </h2>
        <p className="mt-3 text-[var(--color-tinta)]/70 text-center max-w-xl mx-auto">
          {etapas.length} etapas de formación a lo largo de {duracionMeses} meses. Toca cada una para ver
          en qué consiste.
        </p>

        {/* Línea de tiempo del recorrido de la carrera */}
        <div className="mt-14 mb-10 hidden md:block">
          <div className="flex items-start justify-between relative px-2">
            <div className="absolute top-5 left-[6%] right-[6%] h-0.5 bg-[var(--color-linea)]" aria-hidden="true" />

            <div className="relative z-10 flex flex-col items-center text-center w-24">
              <span className="w-10 h-10 rounded-full bg-white border-2 border-[var(--color-verde)] text-[var(--color-verde)] flex items-center justify-center shadow-sm">
                <IconCompass className="w-4 h-4" />
              </span>
              <span className="mt-2 text-xs font-bold text-[var(--color-tinta)]">Inicio</span>
            </div>

            {etapas.map((e) => (
              <button
                key={e.ciclo}
                type="button"
                onClick={() => setAbierta(abierta === e.ciclo - 1 ? null : e.ciclo - 1)}
                className="relative z-10 flex flex-col items-center text-center w-24 group"
              >
                <span className="w-10 h-10 rounded-full bg-[var(--color-naranja)] text-white font-titulo font-bold flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110">
                  {e.ciclo}
                </span>
                <span className="mt-2 text-xs font-bold text-[var(--color-tinta)] group-hover:text-[var(--color-naranja)] transition-colors">
                  Etapa {e.ciclo}
                </span>
              </button>
            ))}

            <div className="relative z-10 flex flex-col items-center text-center w-24">
              <span className="w-10 h-10 rounded-full bg-white border-2 border-[var(--color-verde)] text-[var(--color-verde)] flex items-center justify-center shadow-sm">
                <IconFlag className="w-4 h-4" />
              </span>
              <span className="mt-2 text-xs font-bold text-[var(--color-tinta)]">Titulación</span>
            </div>
          </div>
        </div>

        {/* Acordeón de etapas */}
        <div className="flex flex-col gap-3">
          {etapas.map((e, i) => {
            const estaAbierta = abierta === i;
            return (
              <FadeIn key={e.ciclo} delay={i * 60} duration={500}>
                <div className="rounded-2xl border border-[var(--color-linea)] overflow-hidden transition-shadow duration-300 hover:shadow-md">
                  <button
                    type="button"
                    onClick={() => setAbierta(estaAbierta ? null : i)}
                    aria-expanded={estaAbierta}
                    className="w-full flex items-center gap-4 text-left px-5 py-4 sm:px-6 sm:py-5 bg-[var(--color-fondo)]"
                  >
                    <span className="flex-shrink-0 w-11 h-11 rounded-full bg-[var(--color-verde)] text-white font-titulo font-bold flex items-center justify-center">
                      {e.ciclo}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-titulo font-bold text-[var(--color-verde-oscuro)]">
                        Etapa {e.ciclo}: {e.titulo}
                      </span>
                      <span className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-[var(--color-tinta)]/60 uppercase tracking-wide">
                        <IconClock className="w-3.5 h-3.5" />
                        ~{mesesPorEtapa} meses
                      </span>
                    </span>
                    <IconChevronDown
                      className={`w-5 h-5 flex-shrink-0 text-[var(--color-naranja)] transition-transform duration-300 ${
                        estaAbierta ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      estaAbierta ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm text-[var(--color-tinta)]/80 leading-relaxed">
                        {e.descripcion}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl bg-[var(--color-fondo)] px-5 py-4 flex items-start gap-3">
          <IconChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--color-naranja)]" />
          <p className="text-sm text-[var(--color-tinta)]/70">
            Plan referencial de INCA EDUCA. El detalle de cursos por módulo se confirma con un asesor al
            momento de la postulación.
          </p>
        </div>
      </div>
    </section>
  );
}
