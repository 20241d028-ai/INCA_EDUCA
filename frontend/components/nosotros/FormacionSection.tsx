import Link from "next/link";
import { IconGraduationCap } from "@/components/ui/Icons";
import FadeIn from "@/components/ui/FadeIn";

const CARRERAS_OFICIALES = [
  "Gastronomía",
  "Panadería y Pastelería Industrial",
  "Administración de Servicios de Hostelería",
  "Asistente Administrativo",
  "Logística y Almacén",
  "Operador de Computadoras",
  "Cosmetología",
];

export default function FormacionSection() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <FadeIn>
          <h2 className="font-titulo text-3xl md:text-4xl font-extrabold text-[var(--color-verde-oscuro)]">
            Formación técnica para nuevas oportunidades
          </h2>
          <p className="mt-4 text-[var(--color-tinta)]/70 max-w-2xl mx-auto leading-relaxed">
            Actualmente ofrecemos programas de formación técnica orientados al desarrollo de
            competencias profesionales y a la preparación para el mundo laboral.
          </p>
        </FadeIn>

        <FadeIn delay={150}>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {CARRERAS_OFICIALES.map((nombre) => (
              <span
                key={nombre}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-fondo)] border border-[var(--color-linea)] px-4 py-2.5 text-sm font-semibold text-[var(--color-verde-oscuro)]"
              >
                <IconGraduationCap className="w-4 h-4 text-[var(--color-naranja)]" />
                {nombre}
              </span>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={250}>
          <Link
            href="/carreras"
            className="inline-flex items-center gap-2 mt-10 rounded-full bg-[var(--color-naranja)] text-white font-bold px-7 py-3.5 shadow-md hover:brightness-95 transition"
          >
            Ver todas las carreras
            <span aria-hidden="true">→</span>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
