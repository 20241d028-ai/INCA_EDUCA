import { IconGraduationCap, IconWrench, IconUserCheck, IconRocket } from "@/components/ui/Icons";

const PUNTOS = [
  {
    icono: IconGraduationCap,
    titulo: "Formación técnica",
    descripcion: "Prepárate con una formación orientada al desarrollo de competencias profesionales.",
  },
  {
    icono: IconWrench,
    titulo: "Aprendizaje práctico",
    descripcion: "Desarrolla habilidades mediante una formación práctica y orientada al mundo laboral.",
  },
  {
    icono: IconUserCheck,
    titulo: "Docentes especializados",
    descripcion: "Aprende con profesionales preparados y comprometidos con tu formación.",
  },
  {
    icono: IconRocket,
    titulo: "Preparación para el futuro",
    descripcion: "Adquiere conocimientos y habilidades para enfrentar nuevos retos profesionales.",
  },
];

export default function WhyStudySection() {
  return (
    <section className="bg-[var(--color-verde-oscuro)] py-20">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-titulo text-3xl md:text-4xl font-bold text-white text-center">
          ¿Por qué estudiar en INCA EDUCA?
        </h2>
        <p className="mt-3 text-white/70 text-center max-w-xl mx-auto">
          Una formación pensada para que salgas preparado, con bases sólidas y visión de futuro.
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PUNTOS.map((p) => {
            const Icono = p.icono;
            return (
              <div
                key={p.titulo}
                className="group bg-[var(--color-fondo)] rounded-3xl p-7 shadow-lg transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-2xl"
              >
                <div className="w-14 h-14 rounded-2xl bg-[var(--color-naranja)]/10 flex items-center justify-center text-[var(--color-naranja)] transition-colors duration-300 group-hover:bg-[var(--color-naranja)] group-hover:text-white">
                  <Icono className="w-7 h-7" />
                </div>
                <h3 className="font-titulo font-semibold text-lg mt-5 text-[var(--color-verde-oscuro)]">
                  {p.titulo}
                </h3>
                <p className="mt-2 text-sm text-[var(--color-tinta)]/70 leading-relaxed">
                  {p.descripcion}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
