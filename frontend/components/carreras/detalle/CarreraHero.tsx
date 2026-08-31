import Link from "next/link";
import Image from "next/image";
import Swoosh from "@/components/ui/Swoosh";
import AnclaSuave from "./AnclaSuave";
import type { CarreraContenidoDetallado } from "@/lib/carrerasContenido";

export default function CarreraHero({ contenido }: { contenido: CarreraContenidoDetallado }) {
  return (
    <section className="pt-28 pb-16 sm:pt-32 sm:pb-20 bg-[var(--color-fondo)]">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <div>
          <h1 className="font-titulo uppercase leading-[0.95] text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[var(--color-verde-oscuro)]">
            {contenido.heroTituloLinea1}
            <br />
            <span className="relative inline-block text-[var(--color-naranja)]">
              {contenido.heroTituloLinea2}
              <Swoosh className="absolute left-0 -bottom-1 w-full h-3" />
            </span>
          </h1>

          <p className="mt-6 text-lg text-[var(--color-tinta)]/80 max-w-md leading-relaxed">
            {contenido.heroSubtitulo}
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
              href="#plan-estudios"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[var(--color-verde-oscuro)] text-[var(--color-verde-oscuro)] font-semibold px-8 py-3.5 hover:bg-[var(--color-verde-oscuro)] hover:text-white transition"
            >
              Ver plan de estudios
            </AnclaSuave>
          </div>
        </div>

        <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3]">
          <Image
            src={contenido.heroImagen}
            alt={`Estudiantes de ${contenido.heroTituloLinea1} ${contenido.heroTituloLinea2} de INCA EDUCA en formación práctica`}
            fill
            sizes="(min-width: 1024px) 46vw, 90vw"
            className="object-cover"
            priority
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}
