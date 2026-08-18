import { IconFlag, IconCompass } from "@/components/ui/Icons";
import FadeIn from "@/components/ui/FadeIn";

// Aún no contamos con los textos oficiales de misión y visión. Estas
// tarjetas quedan listas para reemplazar `descripcion` por el contenido
// oficial apenas esté disponible — sin mostrar textos tipo "pendiente" en
// la página pública.
const TARJETAS = [
  {
    icono: IconFlag,
    claseIcono: "bg-[var(--color-naranja)]/10 text-[var(--color-naranja)]",
    titulo: "Misión",
    descripcion: "Aquí se presentará la misión oficial de INCA EDUCA.",
  },
  {
    icono: IconCompass,
    claseIcono: "bg-[var(--color-verde)]/10 text-[var(--color-verde)]",
    titulo: "Visión",
    descripcion: "Aquí se presentará la visión oficial de INCA EDUCA.",
  },
];

export default function MisionVisionSection() {
  return (
    <section className="bg-[var(--color-fondo)] py-20">
      <div className="max-w-4xl mx-auto px-6">
        <FadeIn>
          <h2 className="font-titulo text-3xl md:text-4xl font-extrabold text-[var(--color-verde-oscuro)] text-center">
            Misión y visión
          </h2>
        </FadeIn>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {TARJETAS.map((t, i) => {
            const Icono = t.icono;
            return (
              <FadeIn key={t.titulo} delay={i * 150}>
                <div className="h-full bg-white rounded-3xl shadow-lg p-8 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${t.claseIcono}`}>
                    <Icono className="w-7 h-7" />
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    <h3 className="font-titulo font-extrabold text-xl text-[var(--color-verde-oscuro)]">
                      {t.titulo}
                    </h3>
                    <span className="rounded-full bg-[var(--color-linea)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--color-tinta)]/60">
                      Próximamente
                    </span>
                  </div>

                  <p className="mt-3 text-sm italic text-[var(--color-tinta)]/50 leading-relaxed">
                    {t.descripcion}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
