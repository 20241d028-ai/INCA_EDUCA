import CountUp from "@/components/ui/CountUp";
import FadeIn from "@/components/ui/FadeIn";

// Cifras institucionales — editar aquí si cambian.
const INDICADORES = [
  { to: 400, prefix: "+", etiqueta: "Estudiantes" },
  { to: 2, etiqueta: "Turnos de formación" },
  { to: 7, etiqueta: "Carreras técnicas" },
  { to: 20, suffix: "+", etiqueta: "Años de trayectoria" },
];

export default function ImpactoSection() {
  return (
    <section className="bg-[var(--color-verde-oscuro)] py-20">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <h2 className="font-titulo text-3xl md:text-4xl font-bold text-white text-center">
            Nuestro impacto
          </h2>
        </FadeIn>

        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6 text-center">
          {INDICADORES.map((ind, i) => (
            <FadeIn key={ind.etiqueta} delay={i * 120}>
              <CountUp
                to={ind.to}
                prefix={ind.prefix}
                suffix={ind.suffix}
                className="font-titulo text-4xl sm:text-5xl font-extrabold text-[var(--color-naranja)]"
              />
              <p className="mt-2 text-sm sm:text-base font-semibold text-white/80 uppercase tracking-wide">
                {ind.etiqueta}
              </p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
