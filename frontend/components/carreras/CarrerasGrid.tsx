import Link from "next/link";
import { formatDuracion } from "@/lib/format";

interface Carrera {
  id: string;
  nombre: string;
  slug: string;
  duracionMeses: number;
  imagenUrl: string | null;
  descripcionCorta: string | null;
}

export default function CarrerasGrid({ carreras }: { carreras: Carrera[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {carreras.map((c) => (
        <Link
          key={c.id}
          href={`/carreras/${c.slug}`}
          className="group flex items-stretch gap-4 bg-white rounded-2xl border border-[var(--color-linea)] p-3 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-[var(--color-linea)]">
            <div
              className="w-full h-full bg-cover bg-center transition-transform duration-300 ease-out group-hover:scale-110"
              style={{ backgroundImage: `url('${c.imagenUrl || `/carreras/${c.slug}.jpg`}')` }}
            />
          </div>
          <span className="w-1 rounded-full bg-[var(--color-naranja)]" />
          <div className="py-0.5 flex-1 min-w-0">
            <h3 className="font-titulo font-semibold text-lg text-[var(--color-verde-oscuro)] leading-snug">
              {c.nombre}
            </h3>
            <p className="mt-1 text-sm text-[var(--color-tinta)]/70">
              {c.descripcionCorta || `Duración: ${formatDuracion(c.duracionMeses)}`}
            </p>
            <span className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--color-naranja)] transition-all duration-200 ease-out group-hover:gap-2.5">
              Ver detalles <span aria-hidden="true">→</span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
