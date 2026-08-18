import Link from "next/link";
import FadeIn from "@/components/ui/FadeIn";
import Swoosh from "@/components/ui/Swoosh";
import { IconWhatsApp } from "@/components/ui/Icons";
import { WHATSAPP_URL } from "@/lib/contacto";

export default function ContactoHero() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-verde-oscuro)]">
      <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-16 sm:pt-36 sm:pb-20 md:pt-40 md:pb-24 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-10 items-center">
        <div>
          <FadeIn>
            <h1 className="font-titulo text-4xl sm:text-5xl font-extrabold text-white leading-tight">
              <span className="relative inline-block">
                Contáctanos
                <Swoosh className="absolute left-0 -bottom-2 w-full h-3" color="var(--color-naranja)" />
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={100}>
            <p className="mt-6 text-lg sm:text-xl font-titulo font-bold text-[var(--color-naranja)]">
              Estamos aquí para ayudarte a construir tu futuro.
            </p>
          </FadeIn>

          <FadeIn delay={200}>
            <p className="mt-5 text-white/85 leading-relaxed max-w-md">
              ¿Tienes dudas sobre nuestras carreras, admisión o matrícula? Nuestro
              equipo está listo para orientarte.
            </p>
          </FadeIn>

          <FadeIn delay={300}>
            <div className="mt-9 flex flex-col sm:flex-row gap-4">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-naranja)] text-white font-semibold px-7 py-3.5 shadow-lg transition-all duration-300 ease-out hover:brightness-95 hover:-translate-y-0.5 hover:shadow-xl"
              >
                <IconWhatsApp className="w-5 h-5" />
                Hablar por WhatsApp
              </a>
              <Link
                href="/carreras"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold px-7 py-3.5 transition-all duration-300 ease-out hover:bg-white/20"
              >
                Ver nuestras carreras
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={150}>
          <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] md:aspect-[5/4]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/hero/imagen2.jpg')" }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(20,67,43,0.55) 0%, rgba(20,67,43,0) 45%)",
              }}
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
