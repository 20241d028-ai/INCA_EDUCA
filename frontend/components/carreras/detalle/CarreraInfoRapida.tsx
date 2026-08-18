import type { CarreraContenidoDetallado } from "@/lib/carrerasContenido";

export default function CarreraInfoRapida({ contenido }: { contenido: CarreraContenidoDetallado }) {
  return (
    <section className="bg-[var(--color-fondo)] pb-16 sm:pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="rounded-3xl bg-[var(--color-verde-oscuro)] shadow-xl px-6 py-10 sm:px-10 sm:py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-6 text-center">
            {contenido.statsRapidas.map((s) => (
              <div key={s.etiqueta}>
                <p className="font-titulo text-4xl sm:text-5xl font-extrabold text-[var(--color-naranja)]">
                  {s.valor}
                </p>
                <p className="mt-2 text-sm sm:text-base font-semibold text-white/80 uppercase tracking-wide">
                  {s.etiqueta}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
