import type { CarreraContenidoDetallado } from "@/lib/carrerasContenido";

export default function CarreraPracticaTeoria({ contenido }: { contenido: CarreraContenidoDetallado }) {
  return (
    <section className="bg-[var(--color-verde-oscuro)] py-16 sm:py-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-titulo text-3xl md:text-4xl font-bold text-white">Aprende haciendo</h2>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
          <div>
            <p className="font-titulo text-6xl sm:text-7xl font-extrabold text-[var(--color-naranja)]">
              {contenido.practicaPorcentaje}%
            </p>
            <p className="mt-1 text-sm font-bold text-white/80 uppercase tracking-wide">Práctica</p>
          </div>
          <div className="hidden sm:block w-px h-16 bg-white/20" aria-hidden="true" />
          <div>
            <p className="font-titulo text-6xl sm:text-7xl font-extrabold text-white">
              {contenido.teoriaPorcentaje}%
            </p>
            <p className="mt-1 text-sm font-bold text-white/80 uppercase tracking-wide">Teoría</p>
          </div>
        </div>

        <div
          className="mt-10 max-w-md mx-auto h-2.5 rounded-full bg-white/15 overflow-hidden"
          role="img"
          aria-label={`${contenido.practicaPorcentaje}% de formación práctica y ${contenido.teoriaPorcentaje}% teórica`}
        >
          <div
            className="h-full bg-[var(--color-naranja)] transition-all duration-300 ease-out"
            style={{ width: `${contenido.practicaPorcentaje}%` }}
          />
        </div>

        <p className="mt-8 text-white/85 leading-relaxed max-w-xl mx-auto">{contenido.aprendeHaciendoTexto}</p>
      </div>
    </section>
  );
}
