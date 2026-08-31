import { IconChefHat, IconGlobe, IconRocket, IconGraduationCap, IconStar, IconClipboardList } from "@/components/ui/Icons";
import FadeIn from "@/components/ui/FadeIn";
import type { CarreraContenidoDetallado } from "@/lib/carrerasContenido";

const ICONOS = {
  cocina: IconChefHat,
  cultura: IconGlobe,
  innovacion: IconRocket,
  formacion: IconGraduationCap,
  decoracion: IconStar,
  gestion: IconClipboardList,
} as const;

export default function CarreraSobreLaCarrera({ contenido }: { contenido: CarreraContenidoDetallado }) {
  return (
    <section id="descripcion" className="bg-white py-16 sm:py-20 scroll-mt-28">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-titulo text-3xl md:text-4xl font-bold text-[var(--color-verde-oscuro)] text-center">
          Sobre la carrera
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-center text-[var(--color-tinta)]/75 leading-relaxed">
          {contenido.descripcionIntro}
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contenido.descripcionBloques.map((b, i) => {
            const Icono = ICONOS[b.icono];
            return (
              <FadeIn key={b.titulo} delay={i * 80}>
                <div className="h-full bg-[var(--color-fondo)] rounded-3xl p-7 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-lg">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--color-verde)]/10 flex items-center justify-center text-[var(--color-verde)]">
                    <Icono className="w-7 h-7" />
                  </div>
                  <h3 className="font-titulo font-semibold text-lg mt-5 text-[var(--color-verde-oscuro)]">
                    {b.titulo}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-tinta)]/70 leading-relaxed">{b.texto}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
