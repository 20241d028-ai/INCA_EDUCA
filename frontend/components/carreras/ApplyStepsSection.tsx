import Link from "next/link";
import { IconCompass, IconClipboardList, IconPenLine, IconFlag } from "@/components/ui/Icons";

const PASOS = [
  {
    numero: "01",
    icono: IconCompass,
    titulo: "Elige tu carrera",
    descripcion: "Encuentra la carrera que más se adapte a tus intereses y objetivos.",
  },
  {
    numero: "02",
    icono: IconClipboardList,
    titulo: "Solicita información",
    descripcion: "Conoce los requisitos, duración, modalidad y detalles de la carrera.",
  },
  {
    numero: "03",
    icono: IconPenLine,
    titulo: "Realiza tu inscripción",
    descripcion: "Completa correctamente tu proceso de admisión.",
  },
  {
    numero: "04",
    icono: IconFlag,
    titulo: "¡Comienza a estudiar!",
    descripcion: "Da el primer paso hacia tu futuro profesional.",
  },
];

export default function ApplyStepsSection() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-titulo text-3xl md:text-4xl font-extrabold text-[var(--color-verde-oscuro)] text-center">
          ¿Cómo puedes postular?
        </h2>
        <p className="mt-3 text-[var(--color-tinta)]/70 text-center max-w-xl mx-auto">
          En 4 pasos simples puedes iniciar tu camino profesional en INCA EDUCA.
        </p>

        <div className="mt-16">
          {/* Desktop: 4 columnas conectadas por una línea horizontal */}
          <div className="hidden md:grid md:grid-cols-4 gap-6 relative">
            <div
              className="absolute top-7 left-[12.5%] right-[12.5%] h-0.5 bg-[var(--color-linea)]"
              aria-hidden="true"
            />
            {PASOS.map((p) => {
              const Icono = p.icono;
              return (
                <div key={p.numero} className="relative z-10 text-center">
                  <div className="mx-auto w-14 h-14 rounded-full bg-[var(--color-naranja)] text-white flex items-center justify-center font-titulo font-extrabold shadow-md">
                    {p.numero}
                  </div>
                  <div className="mt-5 flex justify-center text-[var(--color-verde)]">
                    <Icono className="w-6 h-6" />
                  </div>
                  <h3 className="font-titulo font-bold text-lg mt-2 text-[var(--color-tinta)]">
                    {p.titulo}
                  </h3>
                  <p className="mt-1.5 text-sm text-[var(--color-tinta)]/70 max-w-[13rem] mx-auto">
                    {p.descripcion}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Móvil: pasos verticales conectados por una línea */}
          <div className="md:hidden">
            {PASOS.map((p, i) => {
              const Icono = p.icono;
              const esUltimo = i === PASOS.length - 1;
              return (
                <div key={p.numero} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[var(--color-naranja)] text-white flex items-center justify-center font-titulo font-extrabold shadow-md">
                      {p.numero}
                    </div>
                    {!esUltimo && <div className="w-0.5 flex-1 bg-[var(--color-linea)] my-1" />}
                  </div>
                  <div className={esUltimo ? "pb-2" : "pb-8"}>
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

        <div className="mt-16 flex justify-center">
          <Link
            href="/admision"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-naranja)] text-white font-bold px-8 py-3.5 shadow-md hover:brightness-95 transition"
          >
            Postula ahora
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
