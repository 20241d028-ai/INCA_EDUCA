import Link from "next/link";
import type { CarreraContenidoDetallado } from "@/lib/carrerasContenido";

export default function CarreraCTAFinal({ contenido }: { contenido: CarreraContenidoDetallado }) {
  return (
    <section className="bg-[var(--color-verde-oscuro)] py-20 sm:py-24">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <h2 className="font-titulo text-3xl sm:text-4xl font-bold text-white">
          ¿Quieres estudiar {contenido.heroTituloLinea1} {contenido.heroTituloLinea2}?
        </h2>
        <p className="mt-4 text-white/85 leading-relaxed">
          Da el siguiente paso y conoce el proceso de postulación a INCA EDUCA.
        </p>
        <div className="mt-9">
          <Link
            href="/admision"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-naranja)] text-white font-semibold px-8 py-4 shadow-lg hover:brightness-95 hover:-translate-y-0.5 transition"
          >
            Postular ahora
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
