import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { obtenerCarreraPorSlug } from "@/lib/api";
import { generarMallaPlaceholder } from "@/lib/mallas";
import { formatDuracion } from "@/lib/format";
import { obtenerContenidoCarrera } from "@/lib/carrerasContenido";

import CarreraHero from "@/components/carreras/detalle/CarreraHero";
import CarreraInfoRapida from "@/components/carreras/detalle/CarreraInfoRapida";
import CarreraNotaPendiente from "@/components/carreras/detalle/CarreraNotaPendiente";
import CarreraSubnav from "@/components/carreras/detalle/CarreraSubnav";
import CarreraSobreLaCarrera from "@/components/carreras/detalle/CarreraSobreLaCarrera";
import CarreraQueAprenderas from "@/components/carreras/detalle/CarreraQueAprenderas";
import CarreraPlanEstudios from "@/components/carreras/detalle/CarreraPlanEstudios";
import CarreraPracticaTeoria from "@/components/carreras/detalle/CarreraPracticaTeoria";
import CarreraCocinaMundo from "@/components/carreras/detalle/CarreraCocinaMundo";
import CarreraPerfilEgresado from "@/components/carreras/detalle/CarreraPerfilEgresado";
import CarreraCampoLaboral from "@/components/carreras/detalle/CarreraCampoLaboral";
import CarreraEmprendimiento from "@/components/carreras/detalle/CarreraEmprendimiento";
import CarreraGaleria from "@/components/carreras/detalle/CarreraGaleria";
import CarreraFAQ from "@/components/carreras/detalle/CarreraFAQ";
import CarreraCTAFinal from "@/components/carreras/detalle/CarreraCTAFinal";

// Metadata SEO: solo se personaliza para las carreras que ya tienen
// contenido enriquecido (ver lib/carrerasContenido.ts). Las demás no se
// tocan y siguen usando el metadata por defecto del layout.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const contenido = obtenerContenidoCarrera(slug);
  if (!contenido) return {};

  return {
    title: `${contenido.heroTituloLinea1} ${contenido.heroTituloLinea2} | INCA EDUCA`,
    description: contenido.metaDescripcion,
  };
}

export default async function CarreraDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let carrera;
  try {
    carrera = await obtenerCarreraPorSlug(slug);
  } catch {
    notFound();
  }

  // Página completa y modernizada: solo para las carreras que tienen
  // contenido enriquecido definido en lib/carrerasContenido.ts (por ahora,
  // únicamente Gastronomía Internacional). El resto de carreras conserva
  // exactamente la ficha genérica de siempre, sin ningún cambio.
  const contenido = obtenerContenidoCarrera(slug);
  if (contenido) {
    return (
      <main>
        <CarreraHero contenido={contenido} />
        <CarreraInfoRapida contenido={contenido} />
        {contenido.notaPendiente && <CarreraNotaPendiente texto={contenido.notaPendiente} />}
        <CarreraSubnav />
        <CarreraSobreLaCarrera contenido={contenido} />
        <CarreraQueAprenderas contenido={contenido} />
        <CarreraPlanEstudios contenido={contenido} />
        {contenido.practicaPorcentaje !== undefined && contenido.teoriaPorcentaje !== undefined && (
          <CarreraPracticaTeoria contenido={contenido} />
        )}
        {contenido.cocinaPeruana && contenido.cocinaInternacional && (
          <CarreraCocinaMundo contenido={contenido} />
        )}
        <CarreraPerfilEgresado contenido={contenido} />
        <CarreraCampoLaboral contenido={contenido} />
        {contenido.emprendimientoTexto && contenido.emprendimientoEjemplos && (
          <CarreraEmprendimiento contenido={contenido} />
        )}
        <CarreraGaleria contenido={contenido} />
        <CarreraFAQ contenido={contenido} />
        <CarreraCTAFinal contenido={contenido} />
      </main>
    );
  }

  return (
    <main className="pt-24 max-w-4xl mx-auto px-6 pb-16">
      <div
        className="w-full h-64 rounded-3xl bg-cover bg-center bg-[var(--color-linea)]"
        style={{ backgroundImage: `url('${carrera.imagenUrl || `/carreras/${carrera.slug}.jpg`}')` }}
      />
      <h1 className="font-titulo text-4xl font-bold text-[var(--color-tinta)] mt-8">
        {carrera.nombre}
      </h1>
      <p className="mt-2 text-[var(--color-tinta)]/70">
        Duración: {formatDuracion(carrera.duracionMeses)}
      </p>
      <p className="mt-6 text-[var(--color-tinta)] leading-relaxed">
        {carrera.descripcionCorta || "Próximamente más información sobre esta carrera."}
      </p>

      <section className="mt-14">
        <h2 className="font-titulo text-2xl font-bold text-[var(--color-tinta)]">
          Malla curricular
        </h2>
        <p className="mt-1 text-sm text-[var(--color-tinta)]/60">
          Referencial. El plan de estudios detallado se confirma con un asesor.
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {generarMallaPlaceholder(carrera.duracionMeses).map((c) => (
            <div
              key={c.ciclo}
              className="rounded-2xl border border-[var(--color-linea)] p-5 flex items-center gap-4"
            >
              <div className="w-10 h-10 flex-shrink-0 rounded-full bg-[var(--color-verde)] text-white font-titulo font-bold flex items-center justify-center">
                {c.ciclo}
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--color-tinta)]/50 uppercase">
                  Ciclo {c.ciclo}
                </p>
                <p className="font-semibold text-[var(--color-tinta)]">{c.titulo}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Link
        href="/admision"
        className="inline-flex items-center gap-2 mt-12 rounded-full bg-[var(--color-naranja)] text-white font-semibold px-7 py-3.5 hover:brightness-95 transition"
      >
        Postular a esta carrera
        <span aria-hidden="true">→</span>
      </Link>
    </main>
  );
}