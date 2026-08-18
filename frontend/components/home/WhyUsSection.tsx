const PUNTOS = [
  {
    titulo: "Formación práctica",
    descripcion:
      "Clases orientadas a la aplicación real, para que desarrolles habilidades que el mercado laboral necesita.",
  },
  {
    titulo: "Carreras especializadas",
    descripcion:
      "Programas técnicos enfocados en turismo y gastronomía, sectores clave de la economía de Cusco.",
  },
  {
    titulo: "Trayectoria institucional",
    descripcion:
      "Somos un CETPRO (Centro de Educación Técnico-Productiva) formando profesionales técnicos desde 2002.",
  },
  {
    titulo: "Acompañamiento personalizado",
    descripcion:
      "Un asesor te guía durante todo el proceso de inscripción, desde tu primera consulta hasta la matrícula.",
  },
];

export default function WhyUsSection() {
  return (
    <section className="bg-white border-y border-[var(--color-linea)]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="font-titulo text-3xl md:text-4xl font-extrabold text-[var(--color-tinta)] text-center">
          ¿Por qué estudiar en INCA EDUCA?
        </h2>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {PUNTOS.map((p) => (
            <div key={p.titulo} className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-[var(--color-verde)]/10 flex items-center justify-center">
                <span className="w-3 h-3 rounded-full bg-[var(--color-verde)]" />
              </div>
              <h3 className="font-titulo font-bold text-lg mt-4 text-[var(--color-tinta)]">
                {p.titulo}
              </h3>
              <p className="mt-2 text-sm text-[var(--color-tinta)]/70 leading-relaxed">
                {p.descripcion}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
