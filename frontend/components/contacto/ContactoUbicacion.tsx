"use client";

import { useEffect, useState } from "react";
import FadeIn from "@/components/ui/FadeIn";
import { IconMapPin, IconPhone, IconMail, IconClock } from "@/components/ui/Icons";
import {
  DIRECCION,
  TELEFONO,
  TELEFONO_TEL_HREF,
  CORREO,
  HORARIO_ATENCION,
  MAPA_EMBED_URL,
  MAPA_COMO_LLEGAR_URL,
  estaEnHorarioDeAtencion,
} from "@/lib/contacto";

function IndicadorHorario() {
  // Se calcula solo en cliente para evitar diferencias entre el render del
  // servidor y la hora real del navegador (hydration mismatch).
  const [abierto, setAbierto] = useState<boolean | null>(null);

  useEffect(() => {
    // Se calcula la hora real del navegador solo tras montar en cliente,
    // para evitar un mismatch de hidratación con la hora del servidor.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAbierto(estaEnHorarioDeAtencion());
    const intervalo = setInterval(() => setAbierto(estaEnHorarioDeAtencion()), 60_000);
    return () => clearInterval(intervalo);
  }, []);

  if (abierto === null) return null;

  return (
    <div className="mt-3 inline-flex items-center gap-2 text-sm font-semibold">
      <span
        className={`w-2.5 h-2.5 rounded-full ${abierto ? "bg-[var(--color-verde)]" : "bg-[var(--color-tinta)]/30"}`}
        aria-hidden="true"
      />
      <span className={abierto ? "text-[var(--color-verde)]" : "text-[var(--color-tinta)]/50"}>
        {abierto ? "Atención disponible" : "Fuera de horario de atención"}
      </span>
    </div>
  );
}

export default function ContactoUbicacion() {
  return (
    <section id="ubicacion" className="bg-[var(--color-fondo)] py-20 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <h2 className="font-titulo text-3xl md:text-4xl font-bold text-[var(--color-verde-oscuro)] text-center">
            Encuéntranos
          </h2>
        </FadeIn>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <FadeIn delay={100} className="h-full">
            <div className="h-full min-h-[320px] rounded-3xl overflow-hidden border border-[var(--color-linea)] shadow-sm">
              <iframe
                title="Ubicación de INCA EDUCA"
                src={MAPA_EMBED_URL}
                className="w-full h-full min-h-[320px]"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="h-full rounded-3xl bg-white border border-[var(--color-linea)] p-8 sm:p-10">
              <h3 className="font-titulo text-2xl font-semibold text-[var(--color-verde-oscuro)]">
                INCA EDUCA
              </h3>

              <div className="mt-6 space-y-5">
                <div className="flex items-start gap-3">
                  <IconMapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-naranja)]" />
                  <p className="text-[var(--color-tinta)]/80 leading-relaxed">{DIRECCION}</p>
                </div>
                <div className="flex items-start gap-3">
                  <IconPhone className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-naranja)]" />
                  <a href={TELEFONO_TEL_HREF} className="text-[var(--color-tinta)]/80 hover:text-[var(--color-verde-oscuro)] transition-colors">
                    {TELEFONO}
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <IconMail className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-naranja)]" />
                  <a href={`mailto:${CORREO}`} className="text-[var(--color-tinta)]/80 hover:text-[var(--color-verde-oscuro)] transition-colors">
                    {CORREO}
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <IconClock className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-naranja)]" />
                  <div>
                    {HORARIO_ATENCION.map((h) => (
                      <p key={h.dias} className="text-[var(--color-tinta)]/80 leading-relaxed">
                        <span className="font-semibold text-[var(--color-tinta)]">{h.dias}:</span>{" "}
                        {h.horas}
                      </p>
                    ))}
                    <IndicadorHorario />
                  </div>
                </div>
              </div>

              <a
                href={MAPA_COMO_LLEGAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-8 rounded-full bg-[var(--color-verde-oscuro)] text-white font-semibold px-6 py-3 transition-all duration-300 ease-out hover:brightness-110 hover:-translate-y-0.5"
              >
                Cómo llegar
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
