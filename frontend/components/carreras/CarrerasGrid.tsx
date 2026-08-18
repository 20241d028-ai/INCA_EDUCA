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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">
      {carreras.map((c) => (
        <Link
          key={c.id}
          href={`/carreras/${c.slug}`}
          className="flex items-stretch gap-3"
        >
          <div
            className="w-28 h-28 flex-shrink-0 rounded-2xl bg-cover bg-center bg-[var(--color-linea)]"
            style={{ backgroundImage: `url('${c.imagenUrl || `/carreras/${c.slug}.jpg`}')` }}
          />
          <span className="w-1 rounded-full bg-[var(--color-naranja)]" />
          <div className="py-0.5">
            <h3 className="font-titulo font-extrabold text-lg text-[var(--color-verde-oscuro)] leading-snug">
              {c.nombre}
            </h3>
            <p className="mt-1 text-sm text-[var(--color-tinta)]/70">
              {c.descripcionCorta || `Duración: ${formatDuracion(c.duracionMeses)}`}
            </p>
            <span className="mt-1.5 inline-flex items-center gap-1 text-sm font-bold text-[var(--color-naranja)] transition duration-200 ease-out hover:scale-105 hover:-translate-y-0.5 hover:shadow-md hover:underline">
              Ver detalles →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
