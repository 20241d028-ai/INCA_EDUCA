import { IconCheck } from "@/components/ui/Icons";
import FadeIn from "@/components/ui/FadeIn";
import type { CarreraContenidoDetallado } from "@/lib/carrerasContenido";

export default function CarreraQueAprenderas({ contenido }: { contenido: CarreraContenidoDetallado }) {
  return (
    <section className="bg-[var(--color-fondo)] py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-titulo text-3xl md:text-4xl font-bold text-[var(--color-verde-oscuro)] text-center">
          ¿Qué aprenderás?
        </h2>
        <p className="mt-3 text-[var(--color-tinta)]/70 text-center max-w-xl mx-auto">
          Competencias organizadas por área, a lo largo de los 4 módulos de la carrera.
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {contenido.queAprenderas.map((cat, i) => (
            <FadeIn key={cat.titulo} delay={(i % 3) * 80}>
              <div className="h-full bg-white rounded-3xl border border-[var(--color-linea)] p-6 sm:p-7">
                <h3 className="font-titulo font-bold text-lg text-[var(--color-verde-oscuro)]">{cat.titulo}</h3>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--color-tinta)]/80">
                      <IconCheck className="w-4 h-4 flex-shrink-0 mt-0.5 text-[var(--color-naranja)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
