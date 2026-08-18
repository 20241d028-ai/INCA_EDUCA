import { IconFlag, IconGraduationCap, IconUserCheck, IconRocket } from "@/components/ui/Icons";
import FadeIn from "@/components/ui/FadeIn";

const HITOS = [
  {
    año: "2002",
    icono: IconFlag,
    color: "var(--color-naranja)",
    titulo: "Inicio de INCA EDUCA",
    descripcion:
      "INCA EDUCA inicia sus actividades educativas en Cusco, trabajando inicialmente con niños y adolescentes que trabajaban en las calles.",
  },
  {
    año: "2011",
    icono: IconGraduationCap,
    color: "var(--color-verde)",
    titulo: "Reconocimiento como CETPRO",
    descripcion:
      "La institución obtiene la Resolución N.º 287, mediante la cual la Dirección Regional de Educación del Cusco reconoce a INCA EDUCA como CETPRO.",
  },
  {
    año: "ACTUALIDAD",
    icono: IconUserCheck,
    color: "var(--color-naranja)",
    titulo: "Formación técnica",
    descripcion:
      "Cuenta con aproximadamente 400 alumnos en dos turnos y ofrece diferentes carreras técnicas con certificación oficial.",
  },
  {
    año: "PRÓXIMO PASO",
    icono: IconRocket,
    color: "var(--color-verde)",
    titulo: "Hacia la educación superior tecnológica",
    descripcion:
      "Se encuentra en trámite la autorización como Instituto de Educación Superior Tecnológico ante la autoridad correspondiente.",
  },
];

export default function HistoriaTimeline() {
  return (
    <section className="bg-[var(--color-fondo)] py-20">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-titulo text-3xl md:text-4xl font-bold text-[var(--color-verde-oscuro)] text-center">
          Nuestra historia
        </h2>
        <p className="mt-3 text-[var(--color-tinta)]/70 text-center max-w-xl mx-auto">
          Un recorrido desde nuestros inicios hasta hacia dónde nos dirigimos.
        </p>

        <div className="mt-16">
          {/* Desktop: horizontal conectado por una línea */}
          <div className="hidden md:grid md:grid-cols-4 gap-6 relative">
            <div
              className="absolute top-7 left-[12.5%] right-[12.5%] h-0.5 bg-[var(--color-linea)]"
              aria-hidden="true"
            />
            {HITOS.map((h, i) => {
              const Icono = h.icono;
              return (
                <FadeIn key={h.año} delay={i * 150}>
                  <div className="relative z-10 text-center">
                    <div
                      className="mx-auto w-14 h-14 rounded-full text-white flex items-center justify-center shadow-md"
                      style={{ backgroundColor: h.color }}
                    >
                      <Icono className="w-6 h-6" />
                    </div>
                    <p
                      className="mt-4 font-titulo font-extrabold text-sm tracking-wide"
                      style={{ color: h.color }}
                    >
                      {h.año}
                    </p>
                    <h3 className="font-titulo font-bold text-base mt-1 text-[var(--color-tinta)]">
                      {h.titulo}
                    </h3>
                    <p className="mt-1.5 text-sm text-[var(--color-tinta)]/70 max-w-[14rem] mx-auto">
                      {h.descripcion}
                    </p>
                  </div>
                </FadeIn>
              );
            })}
          </div>

          {/* Móvil: vertical conectado por una línea */}
          <div className="md:hidden">
            {HITOS.map((h, i) => {
              const Icono = h.icono;
              const esUltimo = i === HITOS.length - 1;
              return (
                <FadeIn key={h.año} delay={i * 120}>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className="flex-shrink-0 w-14 h-14 rounded-full text-white flex items-center justify-center shadow-md"
                        style={{ backgroundColor: h.color }}
                      >
                        <Icono className="w-6 h-6" />
                      </div>
                      {!esUltimo && <div className="w-0.5 flex-1 bg-[var(--color-linea)] my-1" />}
                    </div>
                    <div className={esUltimo ? "pb-2" : "pb-8"}>
                      <p
                        className="font-titulo font-extrabold text-sm tracking-wide"
                        style={{ color: h.color }}
                      >
                        {h.año}
                      </p>
                      <h3 className="font-titulo font-bold text-base mt-1 text-[var(--color-tinta)]">
                        {h.titulo}
                      </h3>
                      <p className="mt-1.5 text-sm text-[var(--color-tinta)]/70">{h.descripcion}</p>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
