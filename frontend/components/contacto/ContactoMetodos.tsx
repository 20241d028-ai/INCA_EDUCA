"use client";

import { useEffect, useState } from "react";
import FadeIn from "@/components/ui/FadeIn";
import { IconMapPin, IconPhone, IconMail, IconWhatsApp } from "@/components/ui/Icons";
import {
  DIRECCION,
  TELEFONO,
  TELEFONO_TEL_HREF,
  CORREO,
  HORARIO_ATENCION,
  MAPA_COMO_LLEGAR_URL,
  WHATSAPP_URL,
  estaEnHorarioDeAtencion,
} from "@/lib/contacto";

type MetodoId = "visita" | "llamada" | "correo" | "whatsapp";

const METODOS: { id: MetodoId; icono: typeof IconMapPin; titulo: string; resumen: string }[] = [
  { id: "whatsapp", icono: IconWhatsApp, titulo: "WhatsApp", resumen: "Respuesta rápida" },
  { id: "llamada", icono: IconPhone, titulo: "Llámanos", resumen: TELEFONO },
  { id: "correo", icono: IconMail, titulo: "Escríbenos", resumen: CORREO },
  { id: "visita", icono: IconMapPin, titulo: "Visítanos", resumen: "San Sebastián, Cusco" },
];

/**
 * Se calcula solo en cliente para evitar un mismatch de hidratación entre
 * el render del servidor y la hora real del navegador.
 */
function useHorarioAtencion() {
  const [abierto, setAbierto] = useState<boolean | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAbierto(estaEnHorarioDeAtencion());
    const intervalo = setInterval(() => setAbierto(estaEnHorarioDeAtencion()), 60_000);
    return () => clearInterval(intervalo);
  }, []);

  return abierto;
}

export default function ContactoMetodos() {
  const [activo, setActivo] = useState<MetodoId>("whatsapp");
  const abierto = useHorarioAtencion();

  return (
    <section className="bg-white py-24 md:py-28">
      <div className="max-w-[1400px] mx-auto px-6">
        <FadeIn>
          <h2 className="font-titulo text-4xl md:text-5xl font-bold text-[var(--color-verde-oscuro)] text-center">
            Elige cómo prefieres contactarnos
          </h2>
          <p className="mt-4 text-lg text-[var(--color-tinta)]/70 text-center max-w-xl mx-auto">
            Cuatro formas de llegar a nosotros. Elige la que más te acomode.
          </p>
        </FadeIn>

        <FadeIn delay={100}>
          <div className="mt-14 grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-4 lg:gap-8 items-stretch">
            {/* Selector de métodos */}
            <div className="rounded-3xl bg-[var(--color-verde-oscuro)] p-3 sm:p-4 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
              {METODOS.map((m) => {
                const Icono = m.icono;
                const esActivo = m.id === activo;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setActivo(m.id)}
                    aria-pressed={esActivo}
                    className={`group flex-shrink-0 flex items-center gap-4 w-full min-w-[220px] lg:min-w-0 text-left rounded-2xl px-5 py-4 transition-all duration-300 ease-out ${
                      esActivo ? "bg-[var(--color-naranja)] shadow-lg" : "hover:bg-white/10"
                    }`}
                  >
                    <span
                      className={`inline-flex items-center justify-center w-11 h-11 rounded-xl flex-shrink-0 transition-colors duration-300 ${
                        esActivo ? "bg-white/20 text-white" : "bg-white/10 text-white/70 group-hover:text-white"
                      }`}
                    >
                      <Icono className="w-5 h-5" />
                    </span>
                    <span className="min-w-0">
                      <span className={`block font-titulo font-bold text-base ${esActivo ? "text-white" : "text-white/90"}`}>
                        {m.titulo}
                      </span>
                      <span className={`block text-sm truncate ${esActivo ? "text-white/90" : "text-white/50"}`}>
                        {m.resumen}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Panel de detalle — cambia de contenido según el método activo */}
            <div
              key={activo}
              className="rounded-3xl border border-[var(--color-linea)] bg-[var(--color-fondo)] p-8 sm:p-10 lg:p-12 flex flex-col justify-center animate-hero-texto"
            >
              {activo === "whatsapp" && (
                <>
                  <IconWhatsApp className="w-10 h-10 text-[var(--color-verde)]" />
                  <h3 className="mt-5 font-titulo text-2xl sm:text-3xl font-bold text-[var(--color-verde-oscuro)]">
                    Chatea con nosotros
                  </h3>
                  <p className="mt-3 text-lg text-[var(--color-tinta)]/75 leading-relaxed max-w-md">
                    La forma más rápida de resolver tus dudas sobre carreras, admisión y matrícula.
                  </p>
                  {abierto !== null && (
                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold w-fit">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          abierto ? "bg-[var(--color-verde)] animate-pulse" : "bg-[var(--color-tinta)]/30"
                        }`}
                        aria-hidden="true"
                      />
                      <span className={abierto ? "text-[var(--color-verde)]" : "text-[var(--color-tinta)]/50"}>
                        {abierto ? "Atención disponible ahora" : "Fuera de horario — te responderemos pronto"}
                      </span>
                    </div>
                  )}
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn inline-flex items-center gap-2 mt-7 w-fit rounded-full bg-[var(--color-verde)] text-white font-semibold px-7 py-3.5 shadow-md transition-all duration-300 ease-out hover:brightness-95 hover:-translate-y-0.5"
                  >
                    <IconWhatsApp className="w-5 h-5 transition-transform duration-300 ease-out group-hover/btn:scale-110" />
                    Abrir WhatsApp
                  </a>
                </>
              )}

              {activo === "llamada" && (
                <>
                  <IconPhone className="w-10 h-10 text-[var(--color-naranja)]" />
                  <h3 className="mt-5 font-titulo text-2xl sm:text-3xl font-bold text-[var(--color-verde-oscuro)]">
                    Llámanos directamente
                  </h3>
                  <p className="mt-3 font-titulo text-3xl sm:text-4xl font-extrabold text-[var(--color-tinta)]">
                    {TELEFONO}
                  </p>
                  <div className="mt-4 flex flex-col gap-1 text-[var(--color-tinta)]/70">
                    {HORARIO_ATENCION.map((h) => (
                      <p key={h.dias}>
                        <span className="font-semibold text-[var(--color-tinta)]">{h.dias}:</span> {h.horas}
                      </p>
                    ))}
                  </div>
                  <a
                    href={TELEFONO_TEL_HREF}
                    className="inline-flex items-center gap-2 mt-7 w-fit rounded-full bg-[var(--color-verde-oscuro)] text-white font-semibold px-7 py-3.5 transition-all duration-300 ease-out hover:brightness-110 hover:-translate-y-0.5"
                  >
                    Llamar ahora
                    <span aria-hidden="true">→</span>
                  </a>
                </>
              )}

              {activo === "correo" && (
                <>
                  <IconMail className="w-10 h-10 text-[var(--color-naranja)]" />
                  <h3 className="mt-5 font-titulo text-2xl sm:text-3xl font-bold text-[var(--color-verde-oscuro)]">
                    Escríbenos un correo
                  </h3>
                  <p className="mt-3 font-titulo text-2xl sm:text-3xl font-extrabold text-[var(--color-tinta)] break-all">
                    {CORREO}
                  </p>
                  <p className="mt-3 text-[var(--color-tinta)]/70 max-w-md">
                    Respondemos consultas sobre carreras, admisión y matrícula en un plazo breve.
                  </p>
                  <a
                    href={`mailto:${CORREO}`}
                    className="inline-flex items-center gap-2 mt-7 w-fit rounded-full bg-[var(--color-verde-oscuro)] text-white font-semibold px-7 py-3.5 transition-all duration-300 ease-out hover:brightness-110 hover:-translate-y-0.5"
                  >
                    Redactar correo
                    <span aria-hidden="true">→</span>
                  </a>
                </>
              )}

              {activo === "visita" && (
                <>
                  <IconMapPin className="w-10 h-10 text-[var(--color-naranja)]" />
                  <h3 className="mt-5 font-titulo text-2xl sm:text-3xl font-bold text-[var(--color-verde-oscuro)]">
                    Nuestra sede en Cusco
                  </h3>
                  <p className="mt-3 text-lg text-[var(--color-tinta)]/75 leading-relaxed max-w-md">{DIRECCION}</p>
                  <a
                    href={MAPA_COMO_LLEGAR_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-7 w-fit rounded-full bg-[var(--color-verde-oscuro)] text-white font-semibold px-7 py-3.5 transition-all duration-300 ease-out hover:brightness-110 hover:-translate-y-0.5"
                  >
                    Cómo llegar
                    <span aria-hidden="true">→</span>
                  </a>
                </>
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
