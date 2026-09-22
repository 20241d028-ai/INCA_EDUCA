import Link from "next/link";
import FadeIn from "@/components/ui/FadeIn";
import Swoosh from "@/components/ui/Swoosh";
import { IconWhatsApp } from "@/components/ui/Icons";
import { WHATSAPP_URL } from "@/lib/contacto";
import ContactoFormularioCompacto from "@/components/contacto/ContactoFormularioCompacto";

export default function ContactoHero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="relative min-h-screen flex items-center bg-cover bg-[center_30%]"
        style={{ backgroundImage: "url('/hero/graduacion-inca-educa.jpg')" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(20,67,43,0.96) 0%, rgba(20,67,43,0.9) 38%, rgba(20,67,43,0.65) 68%, rgba(20,67,43,0.45) 100%)",
          }}
        />

        <div className="relative w-full max-w-[1400px] mx-auto px-6 pt-24 pb-14 sm:pt-28 sm:pb-16 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">
          {/* Columna izquierda: mensaje */}
          <div className="text-center lg:text-left">
            <FadeIn>
              <h1 className="font-titulo text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg">
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
              <p className="mt-5 text-white/85 leading-relaxed max-w-xl mx-auto lg:mx-0">
                ¿Tienes dudas sobre nuestras carreras, admisión o matrícula? Nuestro
                equipo está listo para orientarte.
              </p>
            </FadeIn>

            <FadeIn delay={300}>
              <div className="mt-9 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
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

          {/* Columna derecha: formulario compacto */}
          <FadeIn delay={150} className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
            <ContactoFormularioCompacto />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
