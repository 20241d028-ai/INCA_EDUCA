import Link from "next/link";
import FadeIn from "@/components/ui/FadeIn";
import { formatDuracion, formatFechaInicio } from "@/lib/format";

interface Carrera {
  id: string;
  nombre: string;
  slug: string;
  duracionMeses: number;
  imagenUrl: string | null;
  descripcionCorta: string | null;
  fechaInicio?: string | null;
}

export default function CarrerasGrid({
  carreras,
  size = "default",
}: {
  carreras: Carrera[];
  size?: "default" | "large";
}) {
  const isLarge = size === "large";

  return (
    <div
      className={
        isLarge
          ? "grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          : "grid grid-cols-1 md:grid-cols-2 gap-5"
      }
    >
      {carreras.map((c, i) => {
        const fechaInicio = formatFechaInicio(c.fechaInicio);
        return (
          <FadeIn key={c.id} delay={i * 80}>
          <Link
            href={`/carreras/${c.slug}`}
            className={
              isLarge
                ? "group flex items-stretch gap-5 bg-white rounded-2xl border border-[var(--color-linea)] p-4 lg:p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg"
                : "group flex items-stretch gap-4 bg-white rounded-2xl border border-[var(--color-linea)] p-3 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg"
            }
          >
            <div
              className={
                isLarge
                  ? "relative w-36 h-36 lg:w-40 lg:h-40 flex-shrink-0 rounded-xl overflow-hidden bg-[var(--color-linea)]"
                  : "relative w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-[var(--color-linea)]"
              }
            >
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-300 ease-out group-hover:scale-110"
                style={{ backgroundImage: `url('${c.imagenUrl || `/carreras/${c.slug}.jpg`}')` }}
              />
              {fechaInicio && (
                <span className="absolute bottom-1.5 left-1.5 right-1.5 rounded-lg bg-[var(--color-verde-oscuro)]/90 backdrop-blur-sm px-2 py-1 text-center text-[10px] sm:text-[11px] font-bold text-white leading-tight">
                  Inicia {fechaInicio}
                </span>
              )}
            </div>
            <span className="w-1 rounded-full bg-[var(--color-naranja)]" />
            <div className={isLarge ? "py-1 flex-1 min-w-0 flex flex-col justify-center" : "py-0.5 flex-1 min-w-0"}>
              <h3
                className={
                  isLarge
                    ? "font-titulo font-semibold text-xl lg:text-2xl text-[var(--color-verde-oscuro)] leading-snug"
                    : "font-titulo font-semibold text-lg text-[var(--color-verde-oscuro)] leading-snug"
                }
              >
                {c.nombre}
              </h3>
              <p className={isLarge ? "mt-2 text-base text-[var(--color-tinta)]/70" : "mt-1 text-sm text-[var(--color-tinta)]/70"}>
                {c.descripcionCorta || `Duración: ${formatDuracion(c.duracionMeses)}`}
              </p>
              <span
                className={
                  isLarge
                    ? "mt-2.5 inline-flex items-center gap-1.5 text-base font-bold text-[var(--color-naranja)] transition-all duration-200 ease-out group-hover:gap-2.5"
                    : "mt-1.5 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--color-naranja)] transition-all duration-200 ease-out group-hover:gap-2.5"
                }
              >
                Ver detalles <span aria-hidden="true">→</span>
              </span>
            </div>
          </Link>
          </FadeIn>
        );
      })}
    </div>
  );
}
