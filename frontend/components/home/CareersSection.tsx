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
  fechaInicio?: string | null;
}

export default function CareersSection({ carreras }: { carreras: Carrera[] }) {
  return (
    <section className="max-w-[1600px] mx-auto px-6 lg:px-10 py-20 md:py-24">
      <FadeIn>
        <h2 className="font-titulo text-4xl md:text-5xl font-bold text-[var(--color-tinta)]">
          Conoce nuestras carreras
        </h2>
        <p className="mt-3 text-lg text-[var(--color-tinta)]/70 max-w-2xl">
          Elige una de nuestras carreras técnicas con formación práctica orientada al mercado laboral.
        </p>
      </FadeIn>

      <FadeIn delay={100}>
        <div className="mt-12">
          <CarrerasGrid carreras={carreras} size="large" />
        </div>
      </FadeIn>

      <FadeIn delay={160}>
        <div className="mt-12 flex justify-center">
          <Link
            href="/carreras"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--color-verde-oscuro)] text-[var(--color-verde-oscuro)] font-semibold text-lg px-8 py-4 hover:bg-[var(--color-verde-oscuro)] hover:text-white transition"
          >
            Ver todas las carreras
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </FadeIn>
    </section>
  );
}
