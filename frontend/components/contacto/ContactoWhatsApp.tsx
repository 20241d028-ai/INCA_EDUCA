import FadeIn from "@/components/ui/FadeIn";
import { IconWhatsApp } from "@/components/ui/Icons";
import { WHATSAPP_URL } from "@/lib/contacto";

export default function ContactoWhatsApp() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-5xl mx-auto px-6">
        <FadeIn>
          <div className="rounded-3xl bg-[var(--color-verde)] px-8 py-12 sm:px-14 sm:py-14 text-center shadow-lg">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-white/15 text-white flex items-center justify-center">
              <IconWhatsApp className="w-8 h-8" />
            </div>

            <h2 className="mt-6 font-titulo text-2xl sm:text-3xl font-bold text-white">
              ¿Prefieres comunicarte directamente con nosotros?
            </h2>
            <p className="mt-4 text-white/90 leading-relaxed max-w-xl mx-auto">
              Comunícate con INCA EDUCA por WhatsApp y recibe orientación sobre
              nuestras carreras, admisión y matrícula.
            </p>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 mt-9 rounded-full bg-white text-[var(--color-verde-oscuro)] font-semibold px-8 py-4 shadow-md transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl"
            >
              <IconWhatsApp className="w-5 h-5 transition-transform duration-300 ease-out group-hover:scale-110" />
              Abrir WhatsApp
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
