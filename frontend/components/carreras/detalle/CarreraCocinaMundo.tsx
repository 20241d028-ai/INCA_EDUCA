import Image from "next/image";
import { IconCheck } from "@/components/ui/Icons";
import type { CarreraContenidoDetallado } from "@/lib/carrerasContenido";

export default function CarreraCocinaMundo({ contenido }: { contenido: CarreraContenidoDetallado }) {
  const cocinaPeruana = contenido.cocinaPeruana ?? [];
  const cocinaInternacional = contenido.cocinaInternacional ?? [];
  if (cocinaPeruana.length === 0 && cocinaInternacional.length === 0) return null;

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-titulo text-3xl md:text-4xl font-bold text-[var(--color-verde-oscuro)] text-center">
          De nuestra cocina al mundo
        </h2>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="relative rounded-3xl overflow-hidden shadow-lg aspect-[4/3] order-first lg:order-last">
            <Image
              src={contenido.heroImagen}
              alt="Preparación de platos de cocina peruana e internacional en INCA EDUCA"
              fill
              sizes="(min-width: 1024px) 46vw, 90vw"
              className="object-cover"
              unoptimized
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="font-titulo font-bold text-lg text-[var(--color-verde-oscuro)]">Cocina peruana</h3>
              <ul className="mt-3 flex flex-col gap-2">
                {cocinaPeruana.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-[var(--color-tinta)]/80">
                    <IconCheck className="w-4 h-4 flex-shrink-0 mt-0.5 text-[var(--color-verde)]" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-titulo font-bold text-lg text-[var(--color-verde-oscuro)]">
                Cocina internacional
              </h3>
              <ul className="mt-3 flex flex-col gap-2">
                {cocinaInternacional.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-[var(--color-tinta)]/80">
                    <IconCheck className="w-4 h-4 flex-shrink-0 mt-0.5 text-[var(--color-naranja)]" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
