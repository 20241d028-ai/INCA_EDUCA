"use client";

import { useState } from "react";
import { IconChevronDown } from "@/components/ui/Icons";
import type { CarreraContenidoDetallado } from "@/lib/carrerasContenido";

export default function CarreraFAQ({ contenido }: { contenido: CarreraContenidoDetallado }) {
  const [abierta, setAbierta] = useState<number | null>(0);

  return (
    <section id="preguntas-frecuentes" className="bg-white py-16 sm:py-20 scroll-mt-28">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="font-titulo text-3xl md:text-4xl font-bold text-[var(--color-verde-oscuro)] text-center">
          Preguntas frecuentes
        </h2>

        <div className="mt-10 flex flex-col gap-3">
          {contenido.faq.map((item, i) => {
            const estaAbierta = abierta === i;
            return (
              <div
                key={item.pregunta}
                className="rounded-2xl border border-[var(--color-linea)] bg-[var(--color-fondo)] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setAbierta(estaAbierta ? null : i)}
                  aria-expanded={estaAbierta}
                  className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 sm:px-6 sm:py-5"
                >
                  <span className="font-titulo font-bold text-[var(--color-tinta)]">{item.pregunta}</span>
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
                    <p className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm text-[var(--color-tinta)]/70 leading-relaxed">
                      {item.respuesta}
                    </p>
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
