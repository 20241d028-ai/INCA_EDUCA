import { IconMapPin, IconPhone, IconMail } from "@/components/ui/Icons";
import FadeIn from "@/components/ui/FadeIn";

const BLOQUES = [
  {
    icono: IconMapPin,
    titulo: "Visítanos",
    valor: "Prol. Av. La Cultura, 6.º paradero San Sebastián, Cusco",
  },
  {
    icono: IconPhone,
    titulo: "Llámanos",
    valor: "(084) 275994",
  },
  {
    icono: IconMail,
    titulo: "Escríbenos",
    valor: "info@incaeduca.edu.pe",
  },
];

export default function ContactoSection() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <FadeIn>
          <h2 className="font-titulo text-3xl md:text-4xl font-extrabold text-[var(--color-verde-oscuro)]">
            ¿Quieres conocer más sobre INCA EDUCA?
          </h2>
        </FadeIn>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {BLOQUES.map((b, i) => {
            const Icono = b.icono;
            return (
              <FadeIn key={b.titulo} delay={i * 120}>
                <div className="h-full rounded-3xl border border-[var(--color-linea)] p-7 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg">
                  <div className="mx-auto w-12 h-12 rounded-2xl bg-[var(--color-verde)]/10 text-[var(--color-verde)] flex items-center justify-center">
                    <Icono className="w-6 h-6" />
                  </div>
                  <h3 className="font-titulo font-bold text-lg mt-4 text-[var(--color-tinta)]">
                    {b.titulo}
                  </h3>
                  <p className="mt-1.5 text-sm text-[var(--color-tinta)]/70 leading-relaxed">
                    {b.valor}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn delay={300}>
          <a
            href="mailto:info@incaeduca.edu.pe"
            className="inline-flex items-center gap-2 mt-10 rounded-full bg-[var(--color-naranja)] text-white font-bold px-7 py-3.5 shadow-md hover:brightness-95 transition"
          >
            Contáctanos
            <span aria-hidden="true">→</span>
          </a>
        </FadeIn>
      </div>
    </section>
  );
}
