"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Envoltorio simple para un efecto de "construcción" (fade-in + desplazamiento
 * + escala + desenfoque) cuando el elemento entra en pantalla. Se desactiva
 * sola después de la primera vez (no vuelve a animar al hacer scroll hacia
 * arriba y abajo).
 *
 * El efecto es notoriamente más intenso y un poco más lento que un fade-in
 * simple, para que se perciba que el contenido (letras, imágenes, gráficos)
 * "se va construyendo" mientras se hace scroll. La duración real que recibe
 * cada elemento se multiplica internamente (SLOWDOWN) para desacelerar el
 * ritmo global manteniendo la proporción entre título → texto → imagen →
 * botones que ya define cada `delay` pasado por el llamador.
 */

// Multiplicador de duración: hace el efecto "un poco más lento" sin tener
// que tocar el `duration` que pasa cada sección.
const SLOWDOWN = 1.4;

export default function FadeIn({
  children,
  delay = 0,
  duration = 700,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  // Duracion base en ms (antes de aplicar SLOWDOWN). 700 para elementos
  // principales (titulos), 400-600 para elementos secundarios (texto,
  // imagenes, botones), siguiendo el mismo ritmo del resto del sitio.
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const duracionReal = Math.round(duration * SLOWDOWN);

  return (
    <div
      ref={ref}
      className={`transition-all ease-out ${
        visible
          ? "opacity-100 translate-y-0 scale-100 blur-none"
          : "opacity-0 translate-y-12 scale-95 blur-sm"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms`, transitionDuration: `${duracionReal}ms` }}
    >
      {children}
    </div>
  );
}
