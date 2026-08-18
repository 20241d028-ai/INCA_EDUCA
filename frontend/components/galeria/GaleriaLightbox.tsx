"use client";

import { useEffect, useRef } from "react";
import { IconX, IconChevronLeft, IconChevronRight } from "@/components/ui/Icons";
import { CATEGORIA_GALERIA_META, type GaleriaItem } from "@/lib/galeria";

const UMBRAL_SWIPE_PX = 50;

export default function GaleriaLightbox({
  fotos,
  indice,
  onCerrar,
  onAnterior,
  onSiguiente,
}: {
  fotos: GaleriaItem[];
  indice: number;
  onCerrar: () => void;
  onAnterior: () => void;
  onSiguiente: () => void;
}) {
  const inicioTouchX = useRef<number | null>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onCerrar();
      if (e.key === "ArrowLeft") onAnterior();
      if (e.key === "ArrowRight") onSiguiente();
    }
    document.addEventListener("keydown", onKeyDown);
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflowPrevio;
    };
  }, [onCerrar, onAnterior, onSiguiente]);

  function onTouchStart(e: React.TouchEvent) {
    inicioTouchX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (inicioTouchX.current === null) return;
    const delta = e.changedTouches[0].clientX - inicioTouchX.current;
    inicioTouchX.current = null;
    if (delta > UMBRAL_SWIPE_PX) onAnterior();
    else if (delta < -UMBRAL_SWIPE_PX) onSiguiente();
  }

  const foto = fotos[indice];
  if (!foto) return null;

  const categoriaLabel = foto.categoria ? CATEGORIA_GALERIA_META[foto.categoria].etiqueta : null;
  const fecha = foto.fechaSubida
    ? new Date(foto.fechaSubida).toLocaleDateString("es-PE", { year: "numeric", month: "long", day: "numeric" })
    : null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onCerrar}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-3xl">
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar"
          className="absolute -top-11 right-0 sm:top-2 sm:right-2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
        >
          <IconX className="w-5 h-5" />
        </button>

        <div
          className="relative rounded-2xl overflow-hidden bg-black shadow-2xl"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {foto.tipo === "video" ? (
            <video
              key={foto.id}
              src={foto.url}
              controls
              autoPlay
              className="animate-galeria-entrada w-full max-h-[65vh] sm:max-h-[70vh] object-contain bg-black"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={foto.id}
              src={foto.url}
              alt={foto.titulo}
              className="animate-galeria-entrada w-full max-h-[65vh] sm:max-h-[70vh] object-contain bg-black"
            />
          )}

          {fotos.length > 1 && (
            <>
              <button
                type="button"
                onClick={onAnterior}
                aria-label="Foto anterior"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition"
              >
                <IconChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={onSiguiente}
                aria-label="Foto siguiente"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition"
              >
                <IconChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        <div className="mt-4 text-center px-2">
          {categoriaLabel && (
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-naranja)]">
              {categoriaLabel}
            </p>
          )}
          <h3 className="mt-1 font-titulo text-xl font-semibold text-white">{foto.titulo}</h3>
          {foto.evento && <p className="mt-1 text-sm text-white/70">{foto.evento}</p>}
          {fecha && <p className="mt-1 text-xs text-white/40 capitalize">{fecha}</p>}
          <p className="mt-3 text-xs font-semibold text-white/50">
            {indice + 1} / {fotos.length}
          </p>
        </div>
      </div>
    </div>
  );
}
