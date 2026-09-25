import Link from "next/link";
import Image from "next/image";
import Swoosh from "@/components/ui/Swoosh";
import AnclaSuave from "./AnclaSuave";
import type { FotoCarrera } from "@/lib/carrerasGenericas";

// Hero para las carreras que todavía no tienen contenido enriquecido
// propio (ver lib/carrerasContenido.ts). Usa únicamente datos reales que
// ya existen en el proyecto: nombre de la base de datos y una fotografía
// real de la Galería de INCA EDUCA (lib/carrerasGenericas.ts). La duración
// y la fecha de inicio se muestran justo debajo, en CarreraInfoRapidaGenerica.
export default function CarreraHeroGenerica({
  nombre,
  foto,
}: {
  nombre: string;
  foto: FotoCarrera;
}) {
  const [primeraLinea, ...resto] = nombre.split(" y ");
  const segundaLinea = resto.join(" y ");

  return (
    <section className="pt-28 pb-14 sm:pt-32 sm:pb-16 bg-[var(--color-fondo)]">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <div>
          <h1 className="font-titulo uppercase leading-[0.95] text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[var(--color-verde-oscuro)]">
            {primeraLinea}
            {segundaLinea && (
              <>
                <br />
                <span className="relative inline-block text-[var(--color-naranja)]">
                  {segundaLinea}
                  <Swoosh className="absolute left-0 -bottom-1 w-full h-3" />
                </span>
              </>
            )}
          </h1>

          <p className="mt-6 text-lg text-[var(--color-tinta)]/80 max-w-md leading-relaxed">
            Formación técnico-productiva de calidad en INCA EDUCA, institución reconocida oficialmente
            como CETPRO desde 2011.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row gap-3">
            <Link
              href="/admision"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-naranja)] text-white font-semibold px-8 py-3.5 shadow-md hover:brightness-95 hover:-translate-y-0.5 transition"
            >
              Postular ahora
              <span aria-hidden="true">→</span>
            </Link>
            <AnclaSuave
              href="#malla-curricular"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[var(--color-verde-oscuro)] text-[var(--color-verde-oscuro)] font-semibold px-8 py-3.5 hover:bg-[var(--color-verde-oscuro)] hover:text-white transition"
            >
              Ver malla curricular
            </AnclaSuave>
          </div>
        </div>

        <div className="group relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3]">
          <Image
            src={foto.src}
            alt={foto.alt}
            fill
            sizes="(min-width: 1024px) 46vw, 90vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            priority
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}
