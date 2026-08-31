import { IconFlag, IconCompass } from "@/components/ui/Icons";
import FadeIn from "@/components/ui/FadeIn";

const TARJETAS = [
  {
    icono: IconFlag,
    claseIcono: "bg-[var(--color-naranja)]/10 text-[var(--color-naranja)]",
    titulo: "Misión",
    parrafos: [
      "INCA EDUCA es una organización solidaria comprometida con brindar una formación técnico-productiva calificada, integral, inclusiva y orientada al desarrollo humano, dirigida principalmente a jóvenes y adultos de bajos recursos económicos de la región.",
      "Nuestra misión es contribuir a mejorar las oportunidades educativas y laborales de nuestros estudiantes mediante una formación basada en conocimientos técnicos, competencias profesionales, valores, responsabilidad, creatividad, liderazgo y emprendimiento.",
      "Buscamos que cada estudiante pueda desarrollar sus capacidades y adquirir herramientas que le permitan afrontar los desafíos del mercado laboral, generar sus propias oportunidades de empleo y mejorar sus condiciones de vida y las de sus familias.",
      "A través de una educación cercana a las necesidades del entorno, promovemos el aprendizaje práctico, la innovación, el emprendimiento y la preparación para el trabajo, fortaleciendo las capacidades de nuestros estudiantes para que puedan participar activamente en el desarrollo económico y social de nuestra región.",
    ],
  },
  {
    icono: IconCompass,
    claseIcono: "bg-[var(--color-verde)]/10 text-[var(--color-verde)]",
    titulo: "Visión",
    parrafos: [
      "En los próximos 5 años, INCA EDUCA busca consolidarse como una institución líder y referente en la formación técnico-productiva de jóvenes y adultos, reconocida por la calidad de su enseñanza, su compromiso social y su aporte al desarrollo de la región.",
      "Aspiramos a formar personas competentes, responsables, innovadoras y emprendedoras, capaces de aplicar sus conocimientos en diferentes contextos laborales y de generar nuevas oportunidades mediante el emprendimiento y la creación de iniciativas productivas.",
      "Nuestra visión es que los estudiantes y egresados de INCA EDUCA puedan desarrollar plenamente sus competencias, fortalecer su liderazgo, mejorar sus capacidades profesionales e insertarse en el mercado laboral en mejores condiciones, contribuyendo al crecimiento de sus familias, comunidades y de la sociedad.",
      "Asimismo, buscamos fortalecer continuamente nuestros programas de formación, metodologías de enseñanza, herramientas tecnológicas y vínculos con empresas e instituciones, con el propósito de ofrecer una educación técnica pertinente, accesible y conectada con las necesidades reales del mercado laboral.",
    ],
  },
];

export default function MisionVisionSection() {
  return (
    <section className="bg-[var(--color-fondo)] py-20">
      <div className="max-w-5xl mx-auto px-6">
        <FadeIn>
          <h2 className="font-titulo text-3xl md:text-4xl font-bold text-[var(--color-verde-oscuro)] text-center">
            Misión y visión
          </h2>
        </FadeIn>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {TARJETAS.map((t, i) => {
            const Icono = t.icono;
            return (
              <FadeIn key={t.titulo} delay={i * 150} className="h-full">
                <div className="h-full bg-white rounded-3xl shadow-lg p-8 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${t.claseIcono}`}>
                    <Icono className="w-7 h-7" />
                  </div>

                  <h3 className="mt-5 font-titulo font-semibold text-xl text-[var(--color-verde-oscuro)]">
                    {t.titulo}
                  </h3>

                  <div className="mt-3 space-y-3">
                    {t.parrafos.map((p, j) => (
                      <p key={j} className="text-sm text-[var(--color-tinta)]/70 leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
