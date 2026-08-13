import Link from "next/link";

const PASOS = [
  {
    numero: 1,
    titulo: "Elige tu carrera ideal",
    descripcion:
      "Selecciona la carrera técnica que mejor se adapte a tus objetivos y a la demanda del mercado laboral.",
  },
  {
    numero: 2,
    titulo: "Completa tu inscripción",
    descripcion:
      "Llena el formulario con tus datos para que un asesor de INCA EDUCA valide tu inscripción.",
  },
  {
    numero: 3,
    titulo: "Inicia tu formación profesional",
    descripcion:
      "Accede a clases prácticas y comienza a desarrollar las habilidades clave para tu futuro laboral.",
  },
];

export default function StepsSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 text-center">
      <h2 className="font-titulo text-3xl md:text-4xl font-extrabold text-[var(--color-tinta)]">
        Inscríbete en INCA EDUCA en 3 simples pasos
      </h2>
      <p className="mt-4 text-[var(--color-tinta)]/70 max-w-2xl mx-auto">
        Iniciar tu formación en un centro técnico-productivo en Cusco nunca fue tan fácil.
        En INCA EDUCA facilitamos tu ingreso para que empieces tu carrera sin complicaciones.
      </p>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        {PASOS.map((p) => (
          <div key={p.numero}>
            <div className="mx-auto w-12 h-12 rounded-full bg-[var(--color-naranja)] text-white font-titulo font-bold text-lg flex items-center justify-center">
              {p.numero}
            </div>
            <h3 className="font-titulo font-bold text-lg mt-4 text-[var(--color-tinta)]">
              {p.titulo}
            </h3>
            <p className="mt-2 text-sm text-[var(--color-tinta)]/70 max-w-xs mx-auto">
              {p.descripcion}
            </p>
          </div>
        ))}
      </div>

      <Link
        href="/admision"
        className="inline-flex items-center gap-2 mt-14 rounded-full bg-[var(--color-verde)] text-white font-bold px-7 py-3.5 hover:brightness-95 transition"
      >
        Inscríbete ahora y asegura tu vacante
        <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}