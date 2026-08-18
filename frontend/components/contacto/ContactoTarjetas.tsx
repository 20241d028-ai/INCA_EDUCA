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
    <section className="bg-[var(--color-fondo)] py-20">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <h2 className="font-titulo text-3xl md:text-4xl font-bold text-[var(--color-verde-oscuro)] text-center">
            ¿Cómo podemos ayudarte?
          </h2>
        </FadeIn>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {TARJETAS.map((t, i) => {
            const Icono = t.icono;
            return (
              <FadeIn key={t.titulo} delay={i * 120}>
                <a
                  href={t.href}
                  className="group block h-full rounded-3xl bg-white border border-[var(--color-linea)] p-8 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:border-[var(--color-verde)]"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[var(--color-verde)]/10 text-[var(--color-verde)] flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-110 group-hover:bg-[var(--color-verde)] group-hover:text-white">
                    <Icono className="w-7 h-7" />
                  </div>
                  <h3 className="font-titulo font-semibold text-xl mt-5 text-[var(--color-verde-oscuro)]">
                    {t.titulo}
                  </h3>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-tinta)]/50">
                    {t.etiqueta}
                  </p>
                  <p className="mt-1 text-[var(--color-tinta)] font-semibold leading-relaxed break-words">
                    {t.valor}
                  </p>
                  <p className="mt-5 text-sm font-bold text-[var(--color-naranja)]">{t.accion}</p>
                </a>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
