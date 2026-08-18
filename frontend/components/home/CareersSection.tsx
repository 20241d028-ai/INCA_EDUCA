import Link from "next/link";
import CarrerasGrid from "@/components/carreras/CarrerasGrid";
import FadeIn from "@/components/ui/FadeIn";

interface Carrera {
  id: string;
  nombre: string;
  slug: string;
  duracionMeses: number;
  imagenUrl: string | null;
  descripcionCorta: string | null;
}

export default function CareersSection({ carreras }: { carreras: Carrera[] }) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <FadeIn>
        <h2 className="font-titulo text-3xl md:text-4xl font-bold text-[var(--color-tinta)]">
          Conoce nuestras carreras
        </h2>
        <p className="mt-2 text-[var(--color-tinta)]/70 max-w-xl">
          Elige una de nuestras carreras técnicas con formación práctica orientada al mercado laboral.
        </p>
      </FadeIn>

      <FadeIn delay={100}>
        <div className="mt-10">
          <CarrerasGrid carreras={carreras} />
        </div>
      </FadeIn>

      <FadeIn delay={160}>
        <div className="mt-10 flex justify-center">
          <Link
            href="/carreras"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--color-verde-oscuro)] text-[var(--color-verde-oscuro)] font-semibold px-7 py-3.5 hover:bg-[var(--color-verde-oscuro)] hover:text-white transition"
          >
            Ver todas las carreras
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </FadeIn>
    </section>
  );
}
