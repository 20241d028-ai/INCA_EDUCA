import Link from "next/link";

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

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {carreras.map((c) => (
          <Link
            key={c.id}
            href={`/carreras/${c.slug}`}
            className="group flex rounded-3xl border border-[var(--color-linea)] overflow-hidden hover:shadow-lg transition"
          >
            <div
              className="w-40 flex-shrink-0 bg-cover bg-center bg-[var(--color-linea)]"
              style={{ backgroundImage: `url('${c.imagenUrl || `/carreras/${c.slug}.jpg`}')` }}
            />
            <div className="p-5">
              <h3 className="font-titulo font-bold text-lg text-[var(--color-tinta)]">
                {c.nombre}
              </h3>
              <p className="mt-1 text-sm text-[var(--color-tinta)]/70">
                {c.descripcionCorta || `Duración: ${c.duracionMeses} meses`}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-naranja)] group-hover:underline">
                Ver detalles →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}