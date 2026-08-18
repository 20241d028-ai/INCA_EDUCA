"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Anima un número de 0 hasta `to` cuando entra en pantalla. Pensado para
 * indicadores tipo "+400", "20+", etc. mediante prefix/suffix.
 */
export default function CountUp({
  to,
  prefix = "",
  suffix = "",
  duration = 1400,
  className = "",
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [valor, setValor] = useState(0);
  const [iniciado, setIniciado] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

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
  }, []);

  useEffect(() => {
    if (!iniciado) return;

    const inicio = performance.now();
    let frame: number;

    const tick = (ahora: number) => {
      const progreso = Math.min((ahora - inicio) / duration, 1);
      const facilitado = 1 - Math.pow(1 - progreso, 3);
      setValor(Math.round(to * facilitado));
      if (progreso < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [iniciado, to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {valor}
      {suffix}
    </span>
  );
}
