"use client";

import { useEffect, useRef, useState } from "react";

// Anima un valor numérico de 0 hasta el número real (ej. "12", "70%", "4")
// cuando entra en pantalla, conservando cualquier prefijo/sufijo no
// numérico del texto original (%, +, etc.). Si el valor no contiene un
// número (ej. "1 año y 4 meses"), se muestra tal cual, sin animar, para no
// producir un conteo sin sentido.
export default function ContadorAnimado({
  valor,
  duracionMs = 1200,
}: {
  valor: string;
  duracionMs?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [iniciado, setIniciado] = useState(false);

  const coincidencia = valor.match(/\d+/);
  const numeroObjetivo = coincidencia ? parseInt(coincidencia[0], 10) : null;
  const prefijo = numeroObjetivo !== null ? valor.slice(0, coincidencia!.index) : "";
  const sufijo = numeroObjetivo !== null ? valor.slice((coincidencia!.index ?? 0) + coincidencia![0].length) : "";

  const [actual, setActual] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || numeroObjetivo === null) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIniciado(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [numeroObjetivo]);

  useEffect(() => {
    if (!iniciado || numeroObjetivo === null) return;

    const inicio = performance.now();
    let frame: number;

    function animar(ahora: number) {
      const progreso = Math.min(1, (ahora - inicio) / duracionMs);
      // ease-out cúbico: arranca rápido y desacelera al final.
      const facilitado = 1 - Math.pow(1 - progreso, 3);
      setActual(Math.round(facilitado * numeroObjetivo!));
      if (progreso < 1) frame = requestAnimationFrame(animar);
    }

    frame = requestAnimationFrame(animar);
    return () => cancelAnimationFrame(frame);
  }, [iniciado, numeroObjetivo, duracionMs]);

  if (numeroObjetivo === null) {
    return <span ref={ref}>{valor}</span>;
  }

  return (
    <span ref={ref}>
      {prefijo}
      {actual}
      {sufijo}
    </span>
  );
}
