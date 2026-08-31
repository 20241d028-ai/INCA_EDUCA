"use client";

import Swoosh from "@/components/ui/Swoosh";

type Segmento = { texto: string; color: string };
type Linea = { tipo: "normal" | "resaltado" | "resaltado-grande"; segmentos: Segmento[] };

const LINEAS: Linea[] = [
  { tipo: "normal", segmentos: [{ texto: "TU FUTURO", color: "#FFFFFF" }] },
  {
    tipo: "normal",
    segmentos: [
      { texto: "TIENE ", color: "#FFFFFF" },
      { texto: "HISTORIA.", color: "var(--color-naranja)" },
    ],
  },
  { tipo: "resaltado", segmentos: [{ texto: "ESTUDIA EN", color: "#FFFFFF" }] },
  { tipo: "resaltado-grande", segmentos: [{ texto: "INCA EDUCA", color: "#FFFFFF" }] },
];

const RETRASO_POR_LETRA = 0.035;

// Precalculado fuera del render: cada letra con su índice global (para el
// retraso escalonado de la animación de caída), preservando la estructura de
// líneas/segmentos/colores para el render.
let contador = 0;
const LINEAS_CON_INDICE = LINEAS.map((linea) => ({
  ...linea,
  segmentos: linea.segmentos.map((segmento) => ({
    ...segmento,
    letras: segmento.texto.split("").map((letra) => ({ letra, indice: contador++ })),
  })),
}));

function Letras({ letras }: { letras: { letra: string; indice: number }[] }) {
  return (
    <>
      {letras.map(({ letra, indice }, i) => (
        <span
          key={i}
          className="animate-letra-cae"
          style={{ animationDelay: `${indice * RETRASO_POR_LETRA}s` }}
        >
          {letra === " " ? " " : letra}
        </span>
      ))}
    </>
  );
}

export default function CarrerasBanner() {
  return (
    <div
      className="absolute inset-0 bg-cover bg-center bg-[var(--color-linea)]"
      style={{ backgroundImage: "url('/banners/inti-raymi-inca-educa.webp')" }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.75) 32%, rgba(0,0,0,0.35) 58%, rgba(0,0,0,0.05) 82%, transparent 100%)",
        }}
      />

      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 lg:p-10">
        <span
          className="font-black leading-none text-4xl sm:text-5xl -mb-2"
          style={{ color: "var(--color-naranja)" }}
          aria-hidden="true"
        >
          &ldquo;
        </span>

        <div className="font-black uppercase italic tracking-tight leading-[0.95]">
          {LINEAS_CON_INDICE.map((linea, i) => {
            const contenido = linea.segmentos.map((segmento, j) => (
              <span key={j} style={{ color: segmento.color }}>
                <Letras letras={segmento.letras} />
              </span>
            ));

            if (linea.tipo === "normal") {
              return (
                <div key={i} className="text-3xl sm:text-4xl lg:text-[2.65rem] drop-shadow-lg">
                  {contenido}
                </div>
              );
            }

            const esGrande = linea.tipo === "resaltado-grande";

            return (
              <div key={i} className={esGrande ? "mt-2" : "mt-1"}>
                <span
                  className={
                    "inline-block -rotate-1 px-3 py-1 shadow-lg " +
                    (esGrande
                      ? "text-4xl sm:text-5xl lg:text-6xl"
                      : "text-3xl sm:text-4xl lg:text-[2.65rem]")
                  }
                  style={{ backgroundColor: "var(--color-verde-oscuro)" }}
                >
                  {contenido}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-end justify-between mt-3">
          <Swoosh className="w-32 sm:w-40 h-3" color="var(--color-naranja)" />
          <span
            className="font-black leading-none text-4xl sm:text-5xl"
            style={{ color: "var(--color-naranja)" }}
            aria-hidden="true"
          >
            &rdquo;
          </span>
        </div>
      </div>
    </div>
  );
}
