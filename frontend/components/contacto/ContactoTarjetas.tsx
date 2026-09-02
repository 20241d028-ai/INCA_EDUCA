import FadeIn from "@/components/ui/FadeIn";
import { IconMapPin, IconPhone, IconMail } from "@/components/ui/Icons";
import { DIRECCION, TELEFONO, TELEFONO_TEL_HREF, CORREO } from "@/lib/contacto";

const TARJETAS = [
  {
    icono: IconMapPin,
    titulo: "Visítanos",
    etiqueta: "Dirección",
    valor: DIRECCION,
    accion: "Ver ubicación →",
    href: "#ubicacion",
    externo: false,
  },
  {
    icono: IconPhone,
    titulo: "Llámanos",
    etiqueta: "Teléfono",
    valor: TELEFONO,
    accion: "Llamar →",
    href: TELEFONO_TEL_HREF,
    externo: false,
  },
  {
    icono: IconMail,
    titulo: "Escríbenos",
    etiqueta: "Correo electrónico",
    valor: CORREO,
    accion: "Enviar →",
    href: `mailto:${CORREO}`,
    externo: false,
  },
];

export default function ContactoTarjetas() {
  return (
    <section className="bg-[var(--color-fondo)] py-24 md:py-28">
      <div className="max-w-[1400px] mx-auto px-6">
        <FadeIn>
          <h2 className="font-titulo text-4xl md:text-5xl font-bold text-[var(--color-verde-oscuro)] text-center">
            ¿Cómo podemos ayudarte?
          </h2>
        </FadeIn>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {TARJETAS.map((t, i) => {
            const Icono = t.icono;
            return (
              <FadeIn key={t.titulo} delay={i * 120}>
                <a
                  href={t.href}
                  className="group block h-full rounded-3xl bg-white border border-[var(--color-linea)] p-10 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:border-[var(--color-verde)]"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[var(--color-verde)]/10 text-[var(--color-verde)] flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-110 group-hover:bg-[var(--color-verde)] group-hover:text-white">
                    <Icono className="w-8 h-8" />
                  </div>
                  <h3 className="font-titulo font-semibold text-2xl mt-6 text-[var(--color-verde-oscuro)]">
                    {t.titulo}
                  </h3>
                  <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-[var(--color-tinta)]/50">
                    {t.etiqueta}
                  </p>
                  <p className="mt-1.5 text-lg text-[var(--color-tinta)] font-semibold leading-relaxed break-words">
                    {t.valor}
                  </p>
                  <p className="mt-6 text-base font-bold text-[var(--color-naranja)]">{t.accion}</p>
                </a>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
