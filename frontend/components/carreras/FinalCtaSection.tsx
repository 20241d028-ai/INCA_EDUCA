import Link from "next/link";
import ParallaxLayer from "@/components/ui/ParallaxLayer";
import FadeIn from "@/components/ui/FadeIn";

export default function FinalCtaSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative py-24 sm:py-28">
        <ParallaxLayer strength={260} className="bg-cover bg-center">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/banners/inti-raymi-inca-educa.webp')" }}
          />
        </ParallaxLayer>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(20,67,43,0.95) 0%, rgba(20,67,43,0.82) 40%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="font-titulo text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg">
              Tu futuro tiene historia
            </h2>
          </FadeIn>
          <FadeIn delay={100}>
            <p className="mt-4 text-xl sm:text-2xl font-titulo font-bold text-[var(--color-naranja)]">
              Escribe tu próxima historia en INCA EDUCA.
            </p>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="mt-5 text-white/85 leading-relaxed max-w-xl mx-auto">
              Conoce nuestras carreras, desarrolla nuevas habilidades y comienza tu formación
              profesional.
            </p>
          </FadeIn>

          <FadeIn delay={300}>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/admision"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-naranja)] text-white font-semibold px-8 py-4 shadow-lg hover:brightness-95 transition"
            >
              POSTULA AHORA
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="#carreras"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border-2 border-white text-white font-semibold px-8 py-4 hover:bg-white hover:text-[var(--color-verde-oscuro)] transition"
            >
              VER CARRERAS
            </Link>
          </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
