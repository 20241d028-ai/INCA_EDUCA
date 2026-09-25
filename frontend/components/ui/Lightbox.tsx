"use client";

import { useEffect } from "react";
import Image from "next/image";
import { IconChevronLeft, IconChevronRight, IconX } from "@/components/ui/Icons";

export interface FotoLightbox {
  src: string;
  alt: string;
}

// Visor ampliado reutilizable para las galerías de fotos de las páginas de
// carrera (tanto la de Gastronomía como las genéricas). Se cierra con la
// X, haciendo click fuera de la foto, o con la tecla Escape; con varias
// fotos se puede navegar con las flechas del teclado o los botones.
export default function Lightbox({
  fotos,
  indice,
  onCerrar,
  onCambiarIndice,
}: {
  fotos: FotoLightbox[];
  indice: number;
  onCerrar: () => void;
  onCambiarIndice: (nuevoIndice: number) => void;
}) {
  const foto = fotos[indice];

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onCerrar();
      if (e.key === "ArrowRight") onCambiarIndice((indice + 1) % fotos.length);
      if (e.key === "ArrowLeft") onCambiarIndice((indice - 1 + fotos.length) % fotos.length);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [indice, fotos.length, onCerrar, onCambiarIndice]);

  if (!foto) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4 sm:p-8 animate-[fadeIn_0.2s_ease-out]"
      onClick={onCerrar}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        onClick={onCerrar}
        aria-label="Cerrar"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
      >
        <IconX className="w-5 h-5" />
      </button>

      {fotos.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onCambiarIndice((indice - 1 + fotos.length) % fotos.length);
          }}
          aria-label="Foto anterior"
          className="absolute left-2 sm:left-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
        >
          <IconChevronLeft className="w-6 h-6" />
        </button>
      )}

      <div
        className="relative w-full max-w-4xl aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image src={foto.src} alt={foto.alt} fill sizes="90vw" className="object-contain bg-black" unoptimized />
      </div>

      {fotos.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onCambiarIndice((indice + 1) % fotos.length);
          }}
          aria-label="Foto siguiente"
          className="absolute right-2 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
        >
          <IconChevronRight className="w-6 h-6" />
        </button>
      )}

      {foto.alt && (
        <p
          className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 max-w-lg text-center text-white/80 text-sm px-4"
          onClick={(e) => e.stopPropagation()}
        >
          {foto.alt}
        </p>
      )}
    </div>
  );
}
