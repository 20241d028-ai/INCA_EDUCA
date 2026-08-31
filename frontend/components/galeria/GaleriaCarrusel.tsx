"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { IconChevronLeft, IconChevronRight, IconPlay } from "@/components/ui/Icons";
import { CATEGORIA_GALERIA_META, type GaleriaItem } from "@/lib/galeria";

type Variante = "grid" | "featured";

const DURACION_AUTOPLAY = 5000;
const PAUSA_TRAS_INTERACCION = 8000;
const MAX_DOTS = 10;

export default function GaleriaCarrusel({
  titulo,
  descripcion,
  fotos,
  variante = "grid",
  autoPlay = false,
  onAbrir,
}: {
  titulo: string;
  descripcion: string;
  fotos: GaleriaItem[];
  variante?: Variante;
  autoPlay?: boolean;
  onAbrir: (indice: number) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [indiceActivo, setIndiceActivo] = useState(0);
  const [pausado, setPausado] = useState(false);
  const pausaTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const irA = useCallback((indice: number) => {
    const cont = scrollRef.current;
    const hijo = cont?.children[indice] as HTMLElement | undefined;
    if (!cont || !hijo) return;
    const contRect = cont.getBoundingClientRect();
    const hijoRect = hijo.getBoundingClientRect();
    cont.scrollTo({ left: cont.scrollLeft + (hijoRect.left - contRect.left), behavior: "smooth" });
  }, []);

  const pausarTemporalmente = useCallback(() => {
    setPausado(true);
    if (pausaTimeoutRef.current) clearTimeout(pausaTimeoutRef.current);
    pausaTimeoutRef.current = setTimeout(() => setPausado(false), PAUSA_TRAS_INTERACCION);
  }, []);

  function anterior() {
    pausarTemporalmente();
    irA(Math.max(0, indiceActivo - 1));
  }

  function siguiente() {
    pausarTemporalmente();
    irA(Math.min(fotos.length - 1, indiceActivo + 1));
  }

  function irADot(indice: number) {
    pausarTemporalmente();
    irA(indice);
  }

  // Reproducción automática: solo si autoPlay=true, hay más de una foto y no
  // está en pausa (por interacción reciente del usuario).
  useEffect(() => {
    if (!autoPlay || pausado || fotos.length <= 1) return;
    const id = setInterval(() => {
      setIndiceActivo((prev) => {
        const sig = (prev + 1) % fotos.length;
        irA(sig);
        return sig;
      });
    }, DURACION_AUTOPLAY);
    return () => clearInterval(id);
  }, [autoPlay, pausado, fotos.length, irA]);

  useEffect(() => {
    return () => {
      if (pausaTimeoutRef.current) clearTimeout(pausaTimeoutRef.current);
    };
  }, []);

  // Detecta qué foto quedó más alineada al borde izquierdo tras un scroll
  // (por swipe táctil, drag con mouse o los botones) para sincronizar dots.
  function onScroll() {
    const cont = scrollRef.current;
    if (!cont) return;
    const contRect = cont.getBoundingClientRect();
    let mejorIndice = 0;
    let mejorDistancia = Infinity;
    Array.from(cont.children).forEach((hijo, i) => {
      const distancia = Math.abs((hijo as HTMLElement).getBoundingClientRect().left - contRect.left);
      if (distancia < mejorDistancia) {
        mejorDistancia = distancia;
        mejorIndice = i;
      }
    });
    setIndiceActivo(mejorIndice);
  }

  const puedeAnterior = indiceActivo > 0;
  const puedeSiguiente = indiceActivo < fotos.length - 1;
  const mostrarDots = fotos.length > 1 && fotos.length <= MAX_DOTS;
  const mostrarBarra = fotos.length > MAX_DOTS;

  return (
    <section className="py-8 sm:py-10">
      <div className="max-w-6xl mx-auto px-6 flex items-end justify-between gap-4">
        <div>
          <h3 className="font-titulo text-2xl sm:text-3xl font-bold text-[var(--color-verde-oscuro)]">
            {titulo}
          </h3>
          <p className="mt-2 max-w-2xl text-[var(--color-tinta)]/70 leading-relaxed">{descripcion}</p>
        </div>
        {fotos.length > 0 && (
          <button
            type="button"
            onClick={() => onAbrir(0)}
            className="inline-flex items-center gap-1.5 flex-shrink-0 text-sm font-semibold text-[var(--color-naranja)] hover:gap-2.5 transition-all duration-200"
          >
            Ver todo
            <span aria-hidden="true">→</span>
          </button>
        )}
      </div>

      {fotos.length === 0 ? (
        <div className="max-w-6xl mx-auto px-6 mt-6">
          <div className="bg-white rounded-2xl border border-[var(--color-linea)] py-14 text-center text-[var(--color-tinta)]/50">
            Aún no hay fotografías disponibles en esta sección.
          </div>
        </div>
      ) : (
        <div className="relative mt-6">
          <div className="max-w-6xl mx-auto px-6">
            <div
              ref={scrollRef}
              onScroll={onScroll}
              onTouchStart={pausarTemporalmente}
              onMouseEnter={pausarTemporalmente}
              className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {fotos.map((foto, i) => (
                <button
                  key={foto.id}
                  type="button"
                  onClick={() => onAbrir(i)}
                  className={`group snap-start shrink-0 text-left ${
                    variante === "featured"
                      ? "basis-full"
                      : "basis-[82%] sm:basis-[46%] lg:basis-[23%]"
                  }`}
                >
                  <div
                    className={`relative overflow-hidden rounded-2xl shadow-sm transition-shadow duration-300 ease-out group-hover:shadow-lg ${
                      variante === "featured" ? "h-[340px] sm:h-[420px] md:h-[480px]" : "h-64 sm:h-72"
                    }`}
                  >
                    {foto.tipo === "video" ? (
                      <video src={foto.url} muted loop playsInline className="w-full h-full object-cover" />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={foto.url}
                        alt={foto.titulo}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                      />
                    )}

                    {foto.tipo === "video" && (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 flex items-center justify-center"
                      >
                        <span className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/90 text-[var(--color-verde-oscuro)] shadow-md backdrop-blur-sm transition-transform duration-300 ease-out group-hover:scale-110">
                          <IconPlay className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5" />
                        </span>
                      </span>
                    )}

                    {variante === "featured" ? (
                      <>
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6 sm:p-8">
                          <p className="text-white font-titulo text-2xl sm:text-3xl font-extrabold drop-shadow">
                            {foto.titulo}
                          </p>
                          {foto.evento && (
                            <p className="mt-1.5 text-white/80 text-sm sm:text-base max-w-lg">{foto.evento}</p>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 ease-out group-hover:bg-black/45" />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 translate-y-2 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                          <p className="text-white font-titulo font-bold text-sm leading-snug drop-shadow">
                            {foto.titulo}
                          </p>
                          <p className="text-white/70 text-xs mt-0.5">
                            {foto.categoria ? CATEGORIA_GALERIA_META[foto.categoria].etiqueta : foto.evento}
                          </p>
                          <p className="mt-1.5 text-white text-xs font-bold">Ver fotografía →</p>
                        </div>
                      </>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {fotos.length > 1 && (
            <>
              <button
                type="button"
                onClick={anterior}
                disabled={!puedeAnterior}
                aria-label="Anterior"
                className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full bg-white shadow-md border border-[var(--color-linea)] text-[var(--color-verde-oscuro)] transition hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-0 disabled:pointer-events-none"
              >
                <IconChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={siguiente}
                disabled={!puedeSiguiente}
                aria-label="Siguiente"
                className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full bg-white shadow-md border border-[var(--color-linea)] text-[var(--color-verde-oscuro)] transition hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-0 disabled:pointer-events-none"
              >
                <IconChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          <div className="max-w-6xl mx-auto px-6">
            <div className="flex sm:hidden items-center justify-center gap-4 mt-4">
              <button
                type="button"
                onClick={anterior}
                disabled={!puedeAnterior}
                aria-label="Anterior"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md border border-[var(--color-linea)] text-[var(--color-verde-oscuro)] transition active:scale-95 disabled:opacity-30"
              >
                <IconChevronLeft className="w-5 h-5" />
              </button>
              {mostrarDots && (
                <div className="flex items-center gap-1.5">
                  {fotos.map((foto, i) => (
                    <button
                      key={foto.id}
                      type="button"
                      onClick={() => irADot(i)}
                      aria-label={`Ir a la foto ${i + 1}`}
                      className={`rounded-full transition-all ${
                        i === indiceActivo ? "w-5 h-2 bg-[var(--color-naranja)]" : "w-2 h-2 bg-[var(--color-linea)]"
                      }`}
                    />
                  ))}
                </div>
              )}
              {mostrarBarra && (
                <span className="text-xs font-bold text-[var(--color-tinta)]/50">
                  {indiceActivo + 1} / {fotos.length}
                </span>
              )}
              <button
                type="button"
                onClick={siguiente}
                disabled={!puedeSiguiente}
                aria-label="Siguiente"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md border border-[var(--color-linea)] text-[var(--color-verde-oscuro)] transition active:scale-95 disabled:opacity-30"
              >
                <IconChevronRight className="w-5 h-5" />
              </button>
            </div>

            {mostrarDots && (
              <div className="hidden sm:flex items-center justify-center gap-1.5 mt-5">
                {fotos.map((foto, i) => (
                  <button
                    key={foto.id}
                    type="button"
                    onClick={() => irADot(i)}
                    aria-label={`Ir a la foto ${i + 1}`}
                    className={`rounded-full transition-all ${
                      i === indiceActivo ? "w-6 h-2 bg-[var(--color-naranja)]" : "w-2 h-2 bg-[var(--color-linea)]"
                    }`}
                  />
                ))}
              </div>
            )}
            {mostrarBarra && (
              <div className="hidden sm:block max-w-xs mx-auto mt-5">
                <div className="h-1 rounded-full bg-[var(--color-linea)] overflow-hidden">
                  <div
                    className="h-full bg-[var(--color-naranja)] transition-all duration-300 ease-out"
                    style={{ width: `${((indiceActivo + 1) / fotos.length) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
