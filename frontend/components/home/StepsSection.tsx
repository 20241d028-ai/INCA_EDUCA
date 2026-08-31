import Link from "next/link";
import { IconCompass, IconPenLine, IconFlag } from "@/components/ui/Icons";
import FadeIn from "@/components/ui/FadeIn";

const PASOS = [
  {
    numero: 1,
    icono: IconCompass,
    titulo: "Elige tu carrera ideal",
    descripcion:
      "Selecciona la carrera técnica que mejor se adapte a tus objetivos y a la demanda del mercado laboral.",
  },
  {
    numero: 2,
    icono: IconPenLine,
    titulo: "Completa tu inscripción",
    descripcion:
      "Llena el formulario con tus datos para que un asesor de INCA EDUCA valide tu inscripción.",
  },
  {
    numero: 3,
    icono: IconFlag,
    titulo: "Inicia tu formación profesional",
    descripcion:
      "Accede a clases prácticas y comienza a desarrollar las habilidades clave para tu futuro laboral.",
  },
];

export default function StepsSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 text-center">
      <FadeIn>
        <h2 className="font-titulo text-3xl md:text-4xl font-bold text-[var(--color-tinta)]">
          Inscríbete en INCA EDUCA en 3 simples pasos
        </h2>
        <p className="mt-4 text-[var(--color-tinta)]/70 max-w-2xl mx-auto">
          Iniciar tu formación en un centro técnico-productivo en Cusco nunca fue tan fácil.
          En INCA EDUCA facilitamos tu ingreso para que empieces tu carrera sin complicaciones.
        </p>
      </FadeIn>

      <div className="mt-16">
        {/* Desktop: 3 columnas conectadas por una línea horizontal */}
        <div className="hidden md:grid md:grid-cols-3 gap-10 relative">
          <div
            className="absolute top-6 left-[16.5%] right-[16.5%] h-0.5 bg-[var(--color-linea)]"
            aria-hidden="true"
          />
          {PASOS.map((p, i) => {
            const Icono = p.icono;
            return (
              <FadeIn key={p.numero} delay={i * 100}>
                <div className="group relative z-10">
                  <div className="mx-auto w-12 h-12 rounded-full bg-[var(--color-naranja)] text-white font-titulo font-bold text-lg flex items-center justify-center shadow-md transition-transform duration-300 ease-out group-hover:scale-110">
                    {p.numero}
                  </div>
                  <div className="mt-4 flex justify-center text-[var(--color-verde)]">
                    <Icono className="w-6 h-6" />
                  </div>
                  <h3 className="font-titulo font-bold text-lg mt-2 text-[var(--color-tinta)]">
                    {p.titulo}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-tinta)]/70 max-w-xs mx-auto">
                    {p.descripcion}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* Móvil: pasos verticales conectados por una línea */}
        <div className="md:hidden flex flex-col text-left max-w-sm mx-auto">
          {PASOS.map((p, i) => {
            const Icono = p.icono;
            const esUltimo = i === PASOS.length - 1;
            return (
              <div key={p.numero} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--color-naranja)] text-white font-titulo font-bold text-lg flex items-center justify-center shadow-md">
                    {p.numero}
                  </div>
                  {!esUltimo && <div className="w-0.5 flex-1 bg-[var(--color-linea)] my-1" />}
                </div>
                <div className={esUltimo ? "pb-1" : "pb-8"}>
                  <div className="flex text-[var(--color-verde)]">
                    <Icono className="w-6 h-6" />
                  </div>
                  <h3 className="font-titulo font-bold text-lg mt-1 text-[var(--color-tinta)]">
                    {p.titulo}
                  </h3>
                  <p className="mt-1.5 text-sm text-[var(--color-tinta)]/70">{p.descripcion}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <FadeIn delay={200}>
        <Link
          href="/admision"
          className="inline-flex items-center gap-2 mt-14 rounded-full bg-[var(--color-verde)] text-white font-semibold px-7 py-3.5 hover:brightness-95 hover:-translate-y-0.5 transition"
        >
          Inscríbete ahora y asegura tu vacante
          <span aria-hidden="true">→</span>
        </Link>
      </FadeIn>
    </section>
  );
}
