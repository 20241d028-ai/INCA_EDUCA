"use client";

import { useEffect, useState } from "react";
import { listarGaleria } from "@/lib/api";
import { CARRUSELES_GALERIA, DESTACADOS_GALERIA, type GaleriaItem } from "@/lib/galeria";
import GaleriaCarrusel from "@/components/galeria/GaleriaCarrusel";
import GaleriaLightbox from "@/components/galeria/GaleriaLightbox";
import FadeIn from "@/components/ui/FadeIn";

interface SeccionAbierta {
  fotos: GaleriaItem[];
  indice: number;
}

export default function GaleriaSecciones() {
  const [items, setItems] = useState<GaleriaItem[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [seccionAbierta, setSeccionAbierta] = useState<SeccionAbierta | null>(null);

  useEffect(() => {
    listarGaleria()
      .then(setItems)
      .catch((e) => setError(e instanceof Error ? e.message : "No se pudo cargar la galería"))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 text-center text-[var(--color-tinta)]/50">
        Cargando galería…
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 text-center text-sm font-semibold text-red-600">
        {error}
      </div>
    );
  }

  const destacados = items
    .filter((i) => i.destacado)
    .sort((a, b) => a.orden - b.orden || +new Date(b.fechaSubida) - +new Date(a.fechaSubida));

  return (
    <>
      {CARRUSELES_GALERIA.map((carrusel, i) => {
        const fotos = items
          .filter((it) => it.categoria === carrusel.categoria)
          .sort((a, b) => a.orden - b.orden || +new Date(b.fechaSubida) - +new Date(a.fechaSubida));

        return (
          <FadeIn key={carrusel.categoria} className={i % 2 === 1 ? "bg-white" : undefined}>
            <GaleriaCarrusel
              titulo={carrusel.titulo}
              descripcion={carrusel.descripcion}
              fotos={fotos}
              variante="grid"
              onAbrir={(indice) => setSeccionAbierta({ fotos, indice })}
            />
          </FadeIn>
        );
      })}

      {destacados.length > 0 && (
        <FadeIn className={CARRUSELES_GALERIA.length % 2 === 1 ? "bg-white" : undefined}>
          <GaleriaCarrusel
            titulo={DESTACADOS_GALERIA.titulo}
            descripcion={DESTACADOS_GALERIA.descripcion}
            fotos={destacados}
            variante="featured"
            autoPlay
            onAbrir={(indice) => setSeccionAbierta({ fotos: destacados, indice })}
          />
        </FadeIn>
      )}

      {seccionAbierta && (
        <GaleriaLightbox
          fotos={seccionAbierta.fotos}
          indice={seccionAbierta.indice}
          onCerrar={() => setSeccionAbierta(null)}
          onAnterior={() =>
            setSeccionAbierta((s) =>
              s ? { ...s, indice: (s.indice - 1 + s.fotos.length) % s.fotos.length } : s
            )
          }
          onSiguiente={() =>
            setSeccionAbierta((s) => (s ? { ...s, indice: (s.indice + 1) % s.fotos.length } : s))
          }
        />
      )}
    </>
  );
}
