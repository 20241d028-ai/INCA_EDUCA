import Link from "next/link";
import Swoosh from "@/components/ui/Swoosh";
import FadeIn from "@/components/ui/FadeIn";

export default function NosotrosHero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="relative bg-cover bg-[center_25%] py-28 sm:py-36"
        style={{ backgroundImage: "url('/hero-inca-educa.jpg')" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(20,67,43,0.96) 0%, rgba(20,67,43,0.78) 42%, rgba(20,67,43,0.4) 72%, rgba(20,67,43,0.2) 100%)",
          }}
        />

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <h1 className="font-titulo text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg">
              Conoce{" "}
              <span className="relative inline-block">
                INCA EDUCA
                <Swoosh className="absolute left-0 -bottom-2 w-full h-3" color="var(--color-naranja)" />
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={100}>
            <p className="mt-6 text-lg sm:text-xl font-titulo font-bold text-[var(--color-naranja)]">
              Más de dos décadas formando oportunidades para jóvenes y adultos en Cusco.
            </p>
          </FadeIn>

          <FadeIn delay={200}>
            <p className="mt-5 text-white/85 leading-relaxed max-w-xl mx-auto">
              Desde 2002 trabajamos para acercar la formación técnica a quienes buscan nuevas
              oportunidades para construir su futuro.
            </p>
          </FadeIn>

          <FadeIn delay={300}>
            <Link
              href="/carreras"
              className="inline-flex items-center gap-2 mt-9 rounded-full bg-[var(--color-naranja)] text-white font-bold px-7 py-3.5 shadow-lg hover:brightness-95 transition"
            >
              Conoce nuestras carreras
              <span aria-hidden="true">→</span>
            </Link>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
