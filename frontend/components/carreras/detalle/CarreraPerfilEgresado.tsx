import { IconCheck } from "@/components/ui/Icons";
import FadeIn from "@/components/ui/FadeIn";
import type { CarreraContenidoDetallado } from "@/lib/carrerasContenido";

export default function CarreraPerfilEgresado({ contenido }: { contenido: CarreraContenidoDetallado }) {
  return (
    <section id="perfil-egreso" className="bg-[var(--color-fondo)] py-16 sm:py-20 scroll-mt-28">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="font-titulo text-3xl md:text-4xl font-bold text-[var(--color-verde-oscuro)] text-center">
          Perfil del egresado
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-center text-[var(--color-tinta)]/75 leading-relaxed">
          {contenido.perfilEgresadoTexto}
        </p>

        {contenido.practicaPorcentaje !== undefined && contenido.teoriaPorcentaje !== undefined && (
          <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
            <span className="rounded-full bg-[var(--color-naranja)] text-white font-titulo font-bold px-5 py-2 text-sm sm:text-base shadow-sm">
              {contenido.practicaPorcentaje}% práctico
            </span>
            <span className="rounded-full bg-white border border-[var(--color-linea)] text-[var(--color-verde-oscuro)] font-titulo font-bold px-5 py-2 text-sm sm:text-base">
              {contenido.teoriaPorcentaje}% teórico
            </span>
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {contenido.perfilEgresadoCompetencias.map((c, i) => (
            <FadeIn key={c} delay={(i % 6) * 60}>
              <div className="flex items-center gap-3 bg-white rounded-2xl border border-[var(--color-linea)] px-5 py-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-verde)]/10 text-[var(--color-verde)] flex items-center justify-center">
                  <IconCheck className="w-4 h-4" />
                </span>
                <span className="text-sm font-semibold text-[var(--color-tinta)]">{c}</span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
