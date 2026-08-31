import {
  IconBuilding,
  IconChefHat,
  IconClipboardList,
  IconUtensils,
  IconMapPin,
  IconShip,
  IconRocket,
  IconGlobe,
  IconBed,
  IconUserCheck,
  IconBriefcase,
  IconStar,
  IconCalculator,
  IconBox,
} from "@/components/ui/Icons";
import FadeIn from "@/components/ui/FadeIn";
import type { CarreraContenidoDetallado } from "@/lib/carrerasContenido";

const ICONOS: Record<string, typeof IconBuilding> = {
  Panificadoras: IconChefHat,
  Hoteles: IconBuilding,
  Restaurantes: IconChefHat,
  Cafeterías: IconUtensils,
  Catering: IconClipboardList,
  "Fast Food": IconUtensils,
  Resorts: IconMapPin,
  Cruceros: IconShip,
  Emprendimiento: IconRocket,
  "Empresas Hoteleras": IconBuilding,
  "Empresas Turísticas": IconGlobe,
  "Recepción y Reservas": IconClipboardList,
  Housekeeping: IconBed,
  "Bar y Comedor": IconUtensils,
  "Administración Hotelera": IconUserCheck,
  "Gobiernos Regionales": IconBuilding,
  Municipalidades: IconMapPin,
  "Proyectos Especiales": IconClipboardList,
  "Entidades Financieras": IconBriefcase,
  "Agencias de Turismo": IconGlobe,
  "Empresa Privada": IconUserCheck,
  "Salón de Belleza": IconStar,
  Spas: IconBuilding,
  "Centros de Estética": IconUserCheck,
  "Empresas Privadas": IconBuilding,
  "Estudios Contables": IconBriefcase,
  "Área de Tesorería": IconCalculator,
  "Área de Facturación": IconClipboardList,
  "Área Administrativa": IconBriefcase,
  "Área de Inventarios": IconBox,
  "Emprendimientos y Negocios": IconRocket,
};

export default function CarreraCampoLaboral({ contenido }: { contenido: CarreraContenidoDetallado }) {
  return (
    <section id="campo-laboral" className="bg-white py-16 sm:py-20 scroll-mt-28">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-titulo text-3xl md:text-4xl font-bold text-[var(--color-verde-oscuro)] text-center">
          Campo laboral
        </h2>
        <p className="mt-3 text-[var(--color-tinta)]/70 text-center max-w-xl mx-auto">
          Espacios donde un egresado de Gastronomía Internacional puede desenvolverse.
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contenido.campoLaboral.map((c, i) => {
            const Icono = ICONOS[c.titulo] ?? IconBuilding;
            return (
              <FadeIn key={c.titulo} delay={(i % 4) * 70}>
                <div className="h-full bg-[var(--color-fondo)] rounded-3xl p-6 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-lg">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--color-verde)]/10 flex items-center justify-center text-[var(--color-verde)]">
                    <Icono className="w-6 h-6" />
                  </div>
                  <h3 className="font-titulo font-bold text-base mt-4 text-[var(--color-verde-oscuro)]">
                    {c.titulo}
                  </h3>
                  <p className="mt-1.5 text-sm text-[var(--color-tinta)]/70 leading-relaxed">{c.descripcion}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
