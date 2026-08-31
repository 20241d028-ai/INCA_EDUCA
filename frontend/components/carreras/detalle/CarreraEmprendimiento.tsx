import { IconChefHat, IconClipboardList, IconRocket, IconStar } from "@/components/ui/Icons";
import type { CarreraContenidoDetallado } from "@/lib/carrerasContenido";

const EJEMPLO_ICONOS = [IconChefHat, IconClipboardList, IconRocket, IconStar];

export default function CarreraEmprendimiento({ contenido }: { contenido: CarreraContenidoDetallado }) {
  const ejemplos = contenido.emprendimientoEjemplos ?? [];
  if (!contenido.emprendimientoTexto || ejemplos.length === 0) return null;

  return (
    <section className="bg-[var(--color-verde-oscuro)] py-16 sm:py-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-titulo text-3xl md:text-4xl font-bold text-white">
          También puedes crear tu propio negocio
        </h2>
        <p className="mt-4 text-white/85 leading-relaxed max-w-2xl mx-auto">{contenido.emprendimientoTexto}</p>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {ejemplos.map((e, i) => {
            const Icono = EJEMPLO_ICONOS[i % EJEMPLO_ICONOS.length];
            return (
              <div key={e} className="bg-white/10 rounded-2xl px-4 py-6 flex flex-col items-center gap-3">
                <Icono className="w-7 h-7 text-[var(--color-naranja)]" />
                <span className="text-sm font-semibold text-white">{e}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
