"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Envuelve una imagen/fondo (o un bloque de texto) y lo desplaza
 * verticalmente en sincronía con el scroll, usando GSAP + ScrollTrigger
 * (scrub: true → sigue el scroll 1 a 1, sin animación "de entrada" propia).
 *
 * `strength` es el desplazamiento MÁXIMO en píxeles hacia cada lado (no un
 * porcentaje): el propio componente se sobredimensiona esa misma cantidad
 * arriba y abajo (position: absolute, top/bottom: -strength) para que nunca
 * queden huecos en los bordes, sin importar el alto real de la sección.
 * Un `strength` más alto = efecto más notorio.
 *
 * Se desactiva sola si el usuario tiene "reducir movimiento" activado.
 */
export default function ParallaxLayer({
  children,
  strength = 90,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefiereMenosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefiereMenosMovimiento) return;

    const contenedor = el.parentElement ?? el;

    const tween = gsap.fromTo(
      el,
      { y: -strength },
      {
        y: strength,
        ease: "none",
        scrollTrigger: {
          trigger: contenedor,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [strength]);

  return (
    <div
      ref={ref}
      className={`absolute inset-x-0 ${className}`}
      style={{ top: -strength, bottom: -strength }}
    >
      {children}
    </div>
  );
}
