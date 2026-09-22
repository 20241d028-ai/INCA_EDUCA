"use client";

import { useEffect, useState } from "react";
import FadeIn from "@/components/ui/FadeIn";
import CountUp from "@/components/ui/CountUp";
import { IconMapPin, IconPhone, IconMail, IconClock, IconCheck, IconCopy } from "@/components/ui/Icons";
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAbierto(estaEnHorarioDeAtencion());
    const intervalo = setInterval(() => setAbierto(estaEnHorarioDeAtencion()), 60_000);
    return () => clearInterval(intervalo);
  }, []);

  if (abierto === null) return null;

  return (
    <div className="inline-flex items-center gap-2 text-sm font-semibold">
      <span
        className={`w-2.5 h-2.5 rounded-full ${abierto ? "bg-[var(--color-verde)] animate-pulse" : "bg-[var(--color-tinta)]/30"}`}
        aria-hidden="true"
      />
      <span className={abierto ? "text-[var(--color-verde)]" : "text-[var(--color-tinta)]/50"}>
        {abierto ? "Atención disponible ahora" : "Fuera de horario de atención"}
      </span>
    </div>
  );
}

/** Botón pequeño que copia un valor al portapapeles y confirma con un check temporal. */
function BotonCopiar({ valor, etiqueta }: { valor: string; etiqueta: string }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(valor);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    } catch {
      // Portapapeles no disponible (permiso o navegador antiguo); no hacemos nada más.
    }
  }

  return (
    <button
      type="button"
      onClick={copiar}
      aria-label={`Copiar ${etiqueta}`}
      className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-[var(--color-tinta)]/35 hover:text-[var(--color-verde)] hover:bg-[var(--color-verde)]/10 transition-colors flex-shrink-0"
    >
      {copiado ? <IconCheck className="w-4 h-4 text-[var(--color-verde)]" /> : <IconCopy className="w-4 h-4" />}
    </button>
  );
}

const CONFIANZA = [
  { to: 20, suffix: "+", etiqueta: "Años formando profesionales" },
  { to: 400, prefix: "+", etiqueta: "Estudiantes en formación" },
  { texto: "San Sebastián, Cusco", etiqueta: "Sede propia y accesible" },
];

export default function ContactoUbicacion() {
  return (
    <section id="ubicacion" className="relative overflow-hidden bg-[var(--color-fondo)] py-24 md:py-28 scroll-mt-24">
      {/* Formas decorativas, coherentes con el Hero de Home */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 w-[420px] h-[420px] bg-[var(--color-verde)]/[0.07] rounded-[58%_42%_38%_62%/55%_35%_65%_45%] animate-blob"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 -left-24 w-[360px] h-[360px] bg-[var(--color-naranja)]/[0.06] rounded-[42%_58%_65%_35%/45%_55%_40%_60%] animate-blob"
        style={{ animationDelay: "2.5s" }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6">
        <FadeIn>
          <span className="flex items-center justify-center gap-2 text-xs sm:text-sm font-bold tracking-widest text-[var(--color-verde)]">
            <span className="w-2 h-2 rotate-45 bg-[var(--color-naranja)]" aria-hidden="true" />
            NUESTRA SEDE
          </span>
          <h2 className="mt-3 font-titulo text-4xl md:text-5xl font-bold text-[var(--color-verde-oscuro)] text-center">
            Encuéntranos
          </h2>
          <p className="mt-4 text-lg text-[var(--color-tinta)]/70 text-center max-w-xl mx-auto">
            Visítanos en Cusco o comunícate con nosotros por cualquiera de estos medios.
          </p>
        </FadeIn>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
          <FadeIn delay={100} className="h-full">
            <div className="group h-full min-h-[440px] md:min-h-[560px] rounded-3xl overflow-hidden border border-[var(--color-linea)] shadow-sm transition-shadow duration-300 hover:shadow-xl">
              <iframe
                title="Ubicación de INCA EDUCA"
                src={MAPA_EMBED_URL}
                className="w-full h-full min-h-[440px] md:min-h-[560px] grayscale-[15%] transition-[filter] duration-300 group-hover:grayscale-0"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="h-full rounded-3xl bg-white border border-[var(--color-linea)] shadow-sm p-10 sm:p-12 transition-shadow duration-300 hover:shadow-xl">
              <h3 className="font-titulo text-3xl font-semibold text-[var(--color-verde-oscuro)]">
                INCA EDUCA
              </h3>

              <div className="mt-8 flex flex-col gap-5">
                <div className="flex items-start gap-4">
                  <span className="inline-flex items-center justify-center w-11 h-11 flex-shrink-0 rounded-xl bg-[var(--color-naranja)]/10 text-[var(--color-naranja)]">
                    <IconMapPin className="w-5 h-5" />
                  </span>
                  <p className="pt-2.5 text-[var(--color-tinta)]/80 leading-relaxed">{DIRECCION}</p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center justify-center w-11 h-11 flex-shrink-0 rounded-xl bg-[var(--color-naranja)]/10 text-[var(--color-naranja)]">
                    <IconPhone className="w-5 h-5" />
                  </span>
                  <a
                    href={TELEFONO_TEL_HREF}
                    className="flex-1 text-[var(--color-tinta)]/80 hover:text-[var(--color-verde-oscuro)] transition-colors"
                  >
                    {TELEFONO}
                  </a>
                  <BotonCopiar valor={TELEFONO} etiqueta="teléfono" />
                </div>

                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center justify-center w-11 h-11 flex-shrink-0 rounded-xl bg-[var(--color-naranja)]/10 text-[var(--color-naranja)]">
                    <IconMail className="w-5 h-5" />
                  </span>
                  <a
                    href={`mailto:${CORREO}`}
                    className="flex-1 text-[var(--color-tinta)]/80 hover:text-[var(--color-verde-oscuro)] transition-colors break-all"
                  >
                    {CORREO}
                  </a>
                  <BotonCopiar valor={CORREO} etiqueta="correo" />
                </div>

                <div className="flex items-start gap-4">
                  <span className="inline-flex items-center justify-center w-11 h-11 flex-shrink-0 rounded-xl bg-[var(--color-naranja)]/10 text-[var(--color-naranja)]">
                    <IconClock className="w-5 h-5" />
                  </span>
                  <div className="pt-2">
                    {HORARIO_ATENCION.map((h) => (
                      <p key={h.dias} className="text-[var(--color-tinta)]/80 leading-relaxed">
                        <span className="font-semibold text-[var(--color-tinta)]">{h.dias}:</span>{" "}
                        {h.horas}
                      </p>
                    ))}
                    <div className="mt-2">
                      <IndicadorHorario />
                    </div>
                  </div>
                </div>
              </div>

              <a
                href={MAPA_COMO_LLEGAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn inline-flex items-center gap-2 mt-10 rounded-full bg-[var(--color-verde-oscuro)] text-white font-semibold text-lg px-8 py-4 transition-all duration-300 ease-out hover:brightness-110 hover:-translate-y-0.5"
              >
                Cómo llegar
                <span aria-hidden="true" className="transition-transform duration-300 group-hover/btn:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </FadeIn>
        </div>

        {/* Franja de confianza */}
        <FadeIn delay={300}>
          <div className="mt-14 rounded-3xl bg-[var(--color-verde-oscuro)] px-8 py-8 sm:px-12 sm:py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 text-center">
            {CONFIANZA.map((c, i) => (
              <div key={c.etiqueta} className={i > 0 ? "sm:border-l sm:border-white/10" : ""}>
                {"to" in c ? (
                  <CountUp
                    to={c.to as number}
                    prefix={c.prefix}
                    suffix={c.suffix}
                    className="font-titulo text-3xl sm:text-4xl font-extrabold text-[var(--color-naranja)]"
                  />
                ) : (
                  <p className="font-titulo text-2xl sm:text-3xl font-extrabold text-[var(--color-naranja)]">
                    {c.texto}
                  </p>
                )}
                <p className="mt-2 text-sm font-semibold text-white/75 uppercase tracking-wide">
                  {c.etiqueta}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
