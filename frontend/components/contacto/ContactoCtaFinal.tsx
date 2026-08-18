import Link from "next/link";
import FadeIn from "@/components/ui/FadeIn";

export default function ContactoCtaFinal() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="relative bg-cover bg-center py-24 sm:py-28"
        style={{ backgroundImage: "url('/banners/inti-raymi-inca-educa.webp')" }}
      >
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
              ¿Listo para dar el siguiente paso?
            </h2>
          </FadeIn>
          <FadeIn delay={100}>
            <p className="mt-5 text-white/85 leading-relaxed max-w-xl mx-auto text-lg">
              Tu futuro profesional comienza aquí.
            </p>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/carreras"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border-2 border-white text-white font-bold px-8 py-4 transition-all duration-300 ease-out hover:bg-white hover:text-[var(--color-verde-oscuro)]"
              >
                CONOCE NUESTRAS CARRERAS
              </Link>
              <Link
                href="/admision"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-naranja)] text-white font-bold px-8 py-4 shadow-lg transition-all duration-300 ease-out hover:brightness-95 hover:-translate-y-0.5"
              >
                POSTULA AHORA
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
