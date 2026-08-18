"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { IconCheck, IconGraduationCap, IconStar, IconUserCheck } from "@/components/ui/Icons";

type Segmento = { texto: string; color?: string };
type KenBurns = "derecha" | "izquierda" | "vertical";
type Cta = { label: string; href: string };

type Slide = {
  src: string;
  alt: string;
  kb: KenBurns;
  posicion?: string;
  etiqueta: string;
  tituloLineas: Segmento[][];
  descripcion: string;
  ctaPrimario: Cta;
  ctaSecundario?: Cta;
};

const SLIDES: Slide[] = [
  {
    src: "/hero/estudiantes-inca-educa-transparente.webp",
    alt: "Estudiantes de Inca Educa con los uniformes de sus carreras: hotelería, gastronomía, panadería y cosmetología",
    kb: "derecha",
    etiqueta: "FORMACIÓN PROFESIONAL",
    tituloLineas: [[{ texto: "TU " }, { texto: "FUTURO", color: "var(--color-verde-oscuro)" }], [{ texto: "COMIENZA ", }, { texto: "AQUÍ.", color: "var(--color-naranja)" }]],
    descripcion:
      "Formación técnica y profesional para desarrollar tus habilidades, potenciar tu talento y prepararte para nuevas oportunidades.",
    ctaPrimario: { label: "Conoce nuestras carreras", href: "/carreras" },
    ctaSecundario: { label: "Postula ahora", href: "/admision" },
  },
  {
    src: "/hero/carrusel-hoteleria-turismo.webp",
    alt: "Estudiante de Inca Educa con el uniforme de la carrera de Hotelería y Turismo",
    kb: "izquierda",
    posicion: "lg:-translate-x-24 lg:translate-y-10",
    etiqueta: "HOTELERÍA Y TURISMO",
    tituloLineas: [[{ texto: "SIRVE CON" }], [{ texto: "EXCELENCIA.", color: "var(--color-naranja)" }]],
    descripcion: "Fórmate en atención, gestión hotelera y turismo, y trabaja en la industria de la hospitalidad.",
    ctaPrimario: { label: "Conoce esta carrera", href: "/carreras" },
    ctaSecundario: { label: "Postula ahora", href: "/admision" },
  },
  {
    src: "/hero/carrusel-gastronomia.webp",
    alt: "Estudiante de Inca Educa con el uniforme de la carrera de Gastronomía",
    kb: "vertical",
    posicion: "lg:-translate-x-24 lg:translate-y-10",
    etiqueta: "GASTRONOMÍA",
    tituloLineas: [[{ texto: "COCINA TU" }], [{ texto: "FUTURO.", color: "var(--color-naranja)" }]],
    descripcion: "Desarrolla técnicas culinarias profesionales y conviértete en un chef de alto nivel.",
    ctaPrimario: { label: "Conoce esta carrera", href: "/carreras" },
    ctaSecundario: { label: "Postula ahora", href: "/admision" },
  },
  {
    src: "/hero/carrusel-panaderia-pasteleria.webp",
    alt: "Estudiante de Inca Educa con el uniforme de la carrera de Panadería y Pastelería",
    kb: "derecha",
    posicion: "lg:-translate-x-24 lg:translate-y-10",
    etiqueta: "PANADERÍA Y PASTELERÍA",
    tituloLineas: [[{ texto: "CREA CON" }], [{ texto: "DULZURA Y TÉCNICA.", color: "var(--color-naranja)" }]],
    descripcion: "Aprende panadería y pastelería industrial con técnicas modernas y mucha creatividad.",
    ctaPrimario: { label: "Conoce esta carrera", href: "/carreras" },
    ctaSecundario: { label: "Postula ahora", href: "/admision" },
  },
  {
    src: "/hero/carrusel-barberia-cosmetologia.webp",
    alt: "Estudiante de Inca Educa con el uniforme de la carrera de Cosmetología y Estética",
    kb: "izquierda",
    posicion: "lg:-translate-x-24 lg:translate-y-10",
    etiqueta: "COSMETOLOGÍA Y ESTÉTICA",
    tituloLineas: [[{ texto: "TRANSFORMA CON" }], [{ texto: "TU TALENTO.", color: "var(--color-naranja)" }]],
    descripcion: "Domina las técnicas de estética, barbería y cuidado personal más demandadas.",
    ctaPrimario: { label: "Conoce esta carrera", href: "/carreras" },
    ctaSecundario: { label: "Postula ahora", href: "/admision" },
  },
];

const STATS = [
  { icono: IconStar, color: "verde" as const, numero: "+20", etiqueta: "años de experiencia" },
  { icono: IconUserCheck, color: "naranja" as const, numero: "400+", etiqueta: "estudiantes" },
  { icono: IconGraduationCap, color: "verde" as const, numero: "7", etiqueta: "carreras técnicas" },
  { icono: IconCheck, color: "naranja" as const, numero: "", etiqueta: "Certificación oficial" },
];

const AUTOPLAY_MS = 6500;
const SWIPE_MIN_PX = 50;

const KB_CLASE: Record<KenBurns, string> = {
  derecha: "hero-kb-derecha",
  izquierda: "hero-kb-izquierda",
  vertical: "hero-kb-vertical",
};

function numero(n: number) {
  return String(n).padStart(2, "0");
}

export default function Hero() {
  const total = SLIDES.length;
  const [indice, setIndice] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [rotas, setRotas] = useState<Set<number>>(new Set());
  const touchInicio = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const irA = (nuevo: number) => setIndice(((nuevo % total) + total) % total);
  const siguiente = () => irA(indice + 1);
  const anterior = () => irA(indice - 1);

  // Autoplay: un único timer que se reinicia al cambiar de slide (manual o
  // automático) y se detiene con pausa/reduced-motion/un solo slide.
  useEffect(() => {
    if (total <= 1 || pausado || reducedMotion) return;
    const id = setTimeout(() => irA(indice + 1), AUTOPLAY_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indice, pausado, reducedMotion, total]);

  // Precarga silenciosa de cada foto para detectar errores sin bloquear el render
  useEffect(() => {
    SLIDES.forEach((s, i) => {
      const img = new window.Image();
      img.onerror = () => setRotas((prev) => new Set(prev).add(i));
      img.src = s.src;
    });
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchInicio.current = { x: t.clientX, y: t.clientY };
    setPausado(true);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const inicio = touchInicio.current;
    touchInicio.current = null;
    setPausado(false);
    if (!inicio) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - inicio.x;
    const dy = t.clientY - inicio.y;
    if (Math.abs(dx) >= SWIPE_MIN_PX && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) siguiente();
      else anterior();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") siguiente();
    else if (e.key === "ArrowLeft") anterior();
  };

  const slide = SLIDES[indice];

  return (
    <section
      className="relative w-full overflow-hidden bg-[var(--color-fondo)] min-h-[100svh] flex flex-col justify-center pb-14 sm:pb-16 focus:outline-none"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carrusel"
      aria-label="Presentación principal de Inca Educa"
    >
      {/* Formas orgánicas decorativas, muy sutiles, dan profundidad sin competir con la foto */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 right-0 w-[520px] h-[520px] bg-[var(--color-verde)]/[0.09] rounded-[58%_42%_38%_62%/55%_35%_65%_45%] animate-blob"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[30%] right-[6%] w-[380px] h-[380px] bg-[var(--color-verde-oscuro)]/[0.08] rounded-[42%_58%_65%_35%/45%_55%_40%_60%] animate-blob"
        style={{ animationDelay: "2s" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -left-28 w-[420px] h-[420px] bg-[var(--color-verde-oscuro)] rounded-[46%_54%_58%_42%/50%_46%_54%_50%] opacity-95"
      />

      {/* Acentos pequeños dispersos */}
      <span aria-hidden="true" className="pointer-events-none absolute top-[17%] left-[38%] w-5 h-5 rounded-full border-2 border-[var(--color-verde)]/35" />
      <span aria-hidden="true" className="pointer-events-none absolute top-[24%] left-[44%] w-2 h-2 rounded-full bg-[var(--color-verde)]/40" />
      <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute top-[41%] left-[43%] w-4 h-4 text-[var(--color-naranja)]/50">
        <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute bottom-[30%] right-[3%] w-4 h-4 text-[var(--color-naranja)]/45">
        <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <span aria-hidden="true" className="pointer-events-none absolute bottom-[22%] left-[2%] w-3 h-3 rounded-full border-2 border-[var(--color-verde)]/30" />
      <div aria-hidden="true" className="pointer-events-none absolute top-[10%] right-[26%] grid grid-cols-3 gap-1.5 opacity-40">
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} className="w-1 h-1 rounded-full bg-[var(--color-verde-oscuro)]" />
        ))}
      </div>

      {/* FOTOGRAFÍA — en pantallas grandes se ancla al borde derecho real del navegador (breakout), más grande y sin caja visible */}
      <div className="relative px-6 sm:px-8 pt-24 sm:pt-28 lg:pt-0 lg:px-0 lg:absolute lg:top-32 lg:bottom-10 lg:right-0 lg:w-[58%] flex justify-center lg:justify-end">
        <div className="relative w-full h-[480px] sm:h-[620px] lg:h-full flex items-end justify-center lg:justify-end overflow-hidden">
          {SLIDES.map((s, i) => {
            const activo = i === indice;
            const rota = rotas.has(i);
            return (
              <div
                key={s.src}
                className={`absolute inset-0 flex items-end justify-center lg:justify-end transition-opacity duration-[900ms] ease-in-out ${s.posicion ?? ""}`}
                style={{ opacity: activo ? 1 : 0 }}
                role="img"
                aria-label={s.alt}
                aria-hidden={!activo}
              >
                {rota ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-verde)]/15 to-[var(--color-fondo)] rounded-3xl" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={s.src}
                    alt=""
                    aria-hidden="true"
                    className={`h-full w-full object-contain object-bottom lg:object-right-bottom ${activo && !reducedMotion ? KB_CLASE[s.kb] : ""}`}
                    style={{
                      maskImage: "radial-gradient(65% 55% at 0% 0%, transparent 15%, black 100%)",
                      WebkitMaskImage: "radial-gradient(65% 55% at 0% 0%, transparent 15%, black 100%)",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 pt-8 lg:pt-32">
        <div className="lg:max-w-[520px] lg:pl-6 lg:[margin-left:clamp(-9rem,calc(-1*max(0px,(100vw-80rem)/2)-2rem),0px)]">
          {/* CONTENIDO */}
          <div key={indice}>
            <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-widest text-[var(--color-verde)] animate-hero-texto w-fit">
              <span className="w-2 h-2 rotate-45 bg-[var(--color-naranja)]" aria-hidden="true" />
              {slide.etiqueta}
            </span>

            <h1
              className="font-titulo font-extrabold leading-[1.05] text-5xl sm:text-6xl lg:text-7xl mt-4 text-[var(--color-tinta)] animate-hero-texto"
              style={{ animationDelay: "80ms" }}
            >
              {slide.tituloLineas.map((linea, li) => (
                <span key={li} className="block">
                  {linea.map((seg, si) => (
                    <span key={si} style={seg.color ? { color: seg.color } : undefined}>
                      {seg.texto}
                    </span>
                  ))}
                </span>
              ))}
            </h1>

            <p
              className="mt-5 text-[var(--color-tinta)]/70 text-lg sm:text-xl leading-relaxed max-w-md animate-hero-texto"
              style={{ animationDelay: "160ms" }}
            >
              {slide.descripcion}
            </p>

            <div
              className="mt-8 flex flex-wrap items-center gap-3 animate-hero-texto"
              style={{ animationDelay: "240ms" }}
            >
              <Link
                href={slide.ctaPrimario.href}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-naranja)] text-white font-bold px-6 sm:px-7 py-3.5 shadow-sm hover:brightness-95 hover:-translate-y-0.5 transition"
              >
                {slide.ctaPrimario.label}
                <span aria-hidden="true">→</span>
              </Link>
              {slide.ctaSecundario && (
                <Link
                  href={slide.ctaSecundario.href}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-tinta)]/15 bg-white text-[var(--color-tinta)] font-semibold px-6 py-3.5 hover:bg-black/[0.03] hover:-translate-y-0.5 transition"
                >
                  {slide.ctaSecundario.label}
                </Link>
              )}
            </div>

            {/* Indicador numérico + barra de progreso + navegación */}
            {total > 1 && (
              <div className="mt-7 flex items-center gap-3">
                <button
                  onClick={anterior}
                  aria-label="Slide anterior"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-[var(--color-tinta)]/15 text-[var(--color-tinta)] opacity-70 hover:opacity-100 hover:scale-110 hover:bg-black/[0.03] transition flex-shrink-0"
                >
                  <span aria-hidden="true" className="text-xs">←</span>
                </button>

                <div className="flex items-center gap-1.5 text-xs font-bold tracking-wide tabular-nums text-[var(--color-tinta)] flex-shrink-0">
                  <span>{numero(indice + 1)}</span>
                  <span className="text-[var(--color-tinta)]/40">/ {numero(total)}</span>
                </div>

                <div className="flex-1 flex gap-1.5 max-w-[140px]">
                  {SLIDES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => irA(i)}
                      aria-label={`Ir al slide ${i + 1}`}
                      aria-current={i === indice}
                      className="relative h-[3px] flex-1 rounded-full bg-[var(--color-tinta)]/15 overflow-hidden"
                    >
                      {i < indice && <span className="absolute inset-0 bg-[var(--color-verde)]/70" />}
                      {i === indice && !pausado && !reducedMotion && (
                        <span
                          key={`progreso-${indice}`}
                          className="absolute inset-y-0 left-0 bg-[var(--color-verde)] animate-hero-progreso"
                          style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
                        />
                      )}
                      {i === indice && (pausado || reducedMotion) && (
                        <span className="absolute inset-0 bg-[var(--color-verde)]/70" />
                      )}
                    </button>
                  ))}
                </div>

                <button
                  onClick={siguiente}
                  aria-label="Slide siguiente"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-[var(--color-tinta)]/15 text-[var(--color-tinta)] opacity-70 hover:opacity-100 hover:scale-110 hover:bg-black/[0.03] transition flex-shrink-0"
                >
                  <span aria-hidden="true" className="text-xs">→</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tarjeta de indicadores institucionales */}
        <div className="relative z-10 mt-10 lg:mt-10 bg-white rounded-3xl shadow-[0_12px_40px_rgba(15,77,53,0.12)] px-6 sm:px-8 py-6 sm:py-7">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-6">
            {STATS.map((stat, i) => {
              const Icono = stat.icono;
              const claseColor =
                stat.color === "verde"
                  ? "bg-[var(--color-verde)]/12 text-[var(--color-verde)]"
                  : "bg-[var(--color-naranja)]/12 text-[var(--color-naranja)]";
              return (
                <div
                  key={i}
                  className={`flex items-center gap-3.5 px-2 sm:px-4 ${
                    i > 0 ? "sm:border-l sm:border-[var(--color-linea)]" : ""
                  }`}
                >
                  <span className={`inline-flex items-center justify-center w-12 h-12 flex-shrink-0 rounded-full ${claseColor}`}>
                    <Icono className="w-6 h-6" />
                  </span>
                  <span className="flex flex-col">
                    {stat.numero && (
                      <span className="font-titulo text-2xl sm:text-3xl font-black text-[var(--color-tinta)] leading-none">
                        {stat.numero}
                      </span>
                    )}
                    <span
                      className={`text-sm font-medium text-[var(--color-tinta)]/65 ${
                        stat.numero ? "mt-1" : "text-base font-bold text-[var(--color-naranja)]"
                      }`}
                    >
                      {stat.etiqueta}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
