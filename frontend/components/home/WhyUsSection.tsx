import { IconWrench, IconGraduationCap, IconClock, IconUserCheck } from "@/components/ui/Icons";
import FadeIn from "@/components/ui/FadeIn";

const PUNTOS = [
  {
    icono: IconWrench,
    titulo: "Formación práctica",
    descripcion:
      "Clases orientadas a la aplicación real, para que desarrolles habilidades que el mercado laboral necesita.",
  },
  {
    icono: IconGraduationCap,
    titulo: "Carreras especializadas",
    descripcion:
      "Programas técnicos enfocados en turismo y gastronomía, sectores clave de la economía de Cusco.",
  },
  {
    icono: IconClock,
    titulo: "Trayectoria institucional",
    descripcion:
      "Somos un CETPRO (Centro de Educación Técnico-Productiva) formando profesionales técnicos desde 2002.",
  },
  {
    icono: IconUserCheck,
    titulo: "Acompañamiento personalizado",
    descripcion:
      "Un asesor te guía durante todo el proceso de inscripción, desde tu primera consulta hasta la matrícula.",
  },
];

export default function WhyUsSection() {
  return (
    <section className="bg-white border-y border-[var(--color-linea)]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <FadeIn>
          <h2 className="font-titulo text-3xl md:text-4xl font-bold text-[var(--color-tinta)] text-center">
            ¿Por qué estudiar en INCA EDUCA?
          </h2>
        </FadeIn>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {PUNTOS.map((p, i) => {
            const Icono = p.icono;
            return (
              <FadeIn key={p.titulo} delay={i * 80}>
                <div className="group h-full text-center bg-[var(--color-fondo)] rounded-3xl p-7 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl">
                  <div className="mx-auto w-14 h-14 rounded-2xl bg-[var(--color-verde)]/10 flex items-center justify-center text-[var(--color-verde)] transition-colors duration-300 group-hover:bg-[var(--color-verde)] group-hover:text-white">
                    <Icono className="w-7 h-7" />
                  </div>
                  <h3 className="font-titulo font-bold text-lg mt-5 text-[var(--color-tinta)]">
                    {p.titulo}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-tinta)]/70 leading-relaxed">
                    {p.descripcion}
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
