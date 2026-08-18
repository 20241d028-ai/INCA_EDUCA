import FadeIn from "@/components/ui/FadeIn";

const BLOQUES = [
  {
    color: "var(--color-naranja)",
    texto:
      "INCA EDUCA inició sus actividades en el año 2002, ofreciendo actividades educativas para niños y adolescentes que trabajaban en las calles del Cusco.",
  },
  {
    color: "var(--color-verde)",
    texto:
      "Un diagnóstico socioeconómico reveló que los jóvenes de escasos recursos tenían dificultades para acceder a centros de formación técnica por los altos costos que estos demandaban.",
  },
  {
    color: "var(--color-naranja)",
    texto:
      "En respuesta, orientamos nuestro trabajo hacia la formación técnica y la generación de oportunidades educativas para jóvenes y adultos.",
  },
  {
    color: "var(--color-verde)",
    texto:
      "En 2011 obtuvimos la Resolución N.º 287, con la que la Dirección Regional de Educación del Cusco nos reconoció oficialmente como CETPRO.",
  },
];

export default function QuienesSomos() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <FadeIn>
          <h2 className="font-titulo text-3xl md:text-4xl font-extrabold text-[var(--color-verde-oscuro)]">
            ¿Quiénes somos?
          </h2>

          <div className="mt-8 flex flex-col gap-5">
            {BLOQUES.map((b, i) => (
              <div key={i} className="pl-4 border-l-4" style={{ borderColor: b.color }}>
                <p className="text-[var(--color-tinta)]/80 leading-relaxed">{b.texto}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={150}>
          <div
            className="w-full h-72 sm:h-96 lg:h-[28rem] rounded-3xl bg-cover bg-center shadow-xl"
            style={{ backgroundImage: "url('/banners/inti-raymi-inca-educa.webp')" }}
            role="img"
            aria-label="Identidad cultural cusqueña de INCA EDUCA"
          />
        </FadeIn>
      </div>
    </section>
  );
}
