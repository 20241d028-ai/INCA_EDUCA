import CarrerasGrid from "@/components/carreras/CarrerasGrid";

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
      <h2 className="font-titulo text-3xl md:text-4xl font-extrabold text-[var(--color-tinta)]">
        Conoce nuestras carreras
      </h2>
      <p className="mt-2 text-[var(--color-tinta)]/70 max-w-xl">
        Elige una de nuestras carreras técnicas con formación práctica orientada al mercado laboral.
      </p>

      <div className="mt-10">
        <CarrerasGrid carreras={carreras} />
      </div>
    </section>
  );
}
