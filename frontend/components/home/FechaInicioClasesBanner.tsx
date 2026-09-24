import FadeIn from "@/components/ui/FadeIn";
import { IconCalendar, IconClock, IconRocket } from "@/components/ui/Icons";
import { formatFechaInicio } from "@/lib/format";

// Sección institucional con la fecha de inicio de clases GENERAL (no es por
// carrera; para eso cada tarjeta de carrera ya muestra su propia fecha).
// Se administra desde /admin/carreras. Si nadie la fijó todavía, no se
// muestra nada: no se inventa una fecha.
export default function FechaInicioClasesBanner({ fechaInicioClases }: { fechaInicioClases: string | null }) {
  const fecha = formatFechaInicio(fechaInicioClases);
  if (!fecha || !fechaInicioClases) return null;

  const hoy = new Date();
  const objetivo = new Date(fechaInicioClases);
  const diasRestantes = Math.ceil((objetivo.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <section className="px-4 sm:px-6 py-10 sm:py-14">
      <FadeIn className="relative overflow-hidden max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-[var(--color-verde-oscuro)] via-[var(--color-verde)] to-[var(--color-verde-oscuro)] shadow-xl shadow-[var(--color-verde-oscuro)]/10">
        {/* Decoración de fondo: círculos y puntos, puramente estéticos */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-16 -top-20 w-56 h-56 rounded-full bg-white/5" />
          <div className="absolute -right-10 -bottom-24 w-64 h-64 rounded-full bg-[var(--color-naranja)]/10" />
          <div
            className="absolute right-10 top-8 w-24 h-24 opacity-20"
            style={{
              backgroundImage: "radial-gradient(white 1.5px, transparent 1.5px)",
              backgroundSize: "12px 12px",
            }}
          />
        </div>

        <div className="relative flex flex-col md:flex-row items-center md:items-stretch gap-8 md:gap-6 p-8 sm:p-10 md:p-12">
          {/* Icono + etiqueta */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left flex-shrink-0">
            <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--color-naranja)] text-white shadow-[0_0_0_6px_rgba(245,154,0,0.15)]">
              <IconRocket className="w-7 h-7" />
            </span>
            <p className="mt-4 text-xs sm:text-sm font-bold uppercase tracking-widest text-[var(--color-naranja)]">
              Nuevo ciclo de clases
            </p>
          </div>

          {/* Separador */}
          <div className="hidden md:block w-px bg-white/15 my-1" />

          {/* Fecha principal */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left justify-center">
            <p className="text-2xl sm:text-3xl font-titulo font-bold text-white leading-tight">
              Inicia el <span className="text-[var(--color-naranja)]">{fecha}</span>
            </p>
            <div className="mt-3 flex items-center gap-2 flex-wrap justify-center md:justify-start">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs sm:text-sm text-white/90 border border-white/20">
                <IconCalendar className="w-3.5 h-3.5 text-[var(--color-naranja)]" />
                {fecha}
              </span>
              {diasRestantes > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs sm:text-sm text-white/90 border border-white/20">
                  <IconClock className="w-3.5 h-3.5 text-[var(--color-naranja)]" />
                  Faltan {diasRestantes} {diasRestantes === 1 ? "día" : "días"}
                </span>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center flex-shrink-0">
            <a
              href="/admision"
              className="rounded-full bg-[var(--color-naranja)] text-white text-sm sm:text-base font-bold px-6 py-3 hover:brightness-110 active:scale-95 transition shadow-lg shadow-black/10 whitespace-nowrap"
            >
              Postula ahora →
            </a>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
