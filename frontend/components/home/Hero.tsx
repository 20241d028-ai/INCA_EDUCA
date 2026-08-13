"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const IMAGENES = ["/hero/imagen1.jpg", "/hero/imagen2.jpg", "/hero/imagen3.webp", "/hero/imagen4.jpg"];

export default function Hero() {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndice((i) => (i + 1) % IMAGENES.length);
    }, 5000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {IMAGENES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000"
          style={{ backgroundImage: `url('${src}')`, opacity: i === indice ? 1 : 0 }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-tinta)]/80 via-[var(--color-tinta)]/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-tinta)]/50 via-transparent to-transparent" />

      <div className="relative h-full flex items-center max-w-6xl mx-auto px-8">
        <div className="max-w-xl">
          <h1 className="font-titulo text-white text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
            Educación <span className="text-[var(--color-verde)]">Sin</span>{" "}
            <span className="text-[var(--color-naranja)]">límites</span>
          </h1>
          <p className="mt-5 text-white/90 text-lg leading-relaxed drop-shadow">
            La educación es el proceso de facilitar el aprendizaje, o la
            adquisición de conocimientos.
          </p>
          <Link
            href="/carreras"
            className="inline-flex items-center gap-2 mt-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold px-7 py-3.5 shadow-lg hover:bg-white/30 transition"
          >
            Ver carreras
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {IMAGENES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndice(i)}
            aria-label={`Ver imagen ${i + 1}`}
            className={`h-2 rounded-full transition-all shadow-md ${
              i === indice ? "w-6 bg-white" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}