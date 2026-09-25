import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { obtenerCarreraPorSlug } from "@/lib/api";
import { generarMallaPlaceholder } from "@/lib/mallas";
import { formatDuracion, formatFechaInicio } from "@/lib/format";
import { obtenerContenidoCarrera } from "@/lib/carrerasContenido";
import { CARRERAS_GENERICAS } from "@/lib/carrerasGenericas";

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
import CarreraHeroGenerica from "@/components/carreras/detalle/CarreraHeroGenerica";
import CarreraInfoRapidaGenerica from "@/components/carreras/detalle/CarreraInfoRapidaGenerica";
import CarreraMallaGenerica from "@/components/carreras/detalle/CarreraMallaGenerica";
import CarreraGaleriaGenerica from "@/components/carreras/detalle/CarreraGaleriaGenerica";
import CarreraCTAFinalGenerica from "@/components/carreras/detalle/CarreraCTAFinalGenerica";
import CarreraSubnavGenerica from "@/components/carreras/detalle/CarreraSubnavGenerica";

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

  const fechaInicio = formatFechaInicio(carrera.fechaInicio);

  // Página completa y modernizada: solo para las carreras que tienen
  // contenido enriquecido definido en lib/carrerasContenido.ts (por ahora,
  // únicamente Gastronomía Internacional). El resto de carreras conserva
  // exactamente la ficha genérica de siempre, sin ningún cambio.
  const contenido = obtenerContenidoCarrera(slug);
  if (contenido) {
    return (
      <main>
        <CarreraHero contenido={contenido} />
        <CarreraInfoRapida contenido={contenido} fechaInicio={fechaInicio} />
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

  // Página visualmente rica para las carreras que aún no tienen contenido
  // enriquecido propio (todas menos Gastronomía Internacional). Usa
  // únicamente datos reales: nombre/duración/fecha de la base de datos, el
  // número de etapas calculado a partir de la duración real, y fotografías
  // reales de la Galería de INCA EDUCA (lib/carrerasGenericas.ts). No
  // reemplaza el listado general de carreras ni sus tarjetas.
  const fotosGenericas = CARRERAS_GENERICAS[carrera.slug];
  const etapas = generarMallaPlaceholder(carrera.duracionMeses);
  const duracionTexto = formatDuracion(carrera.duracionMeses);

  return (
    <main>
      <CarreraHeroGenerica
        nombre={carrera.nombre}
        foto={
          fotosGenericas?.heroImagen ?? {
            src: carrera.imagenUrl || `/carreras/${carrera.slug}.jpg`,
            alt: `Estudiantes de ${carrera.nombre} de INCA EDUCA`,
          }
        }
      />
      <CarreraInfoRapidaGenerica
        duracionTexto={duracionTexto}
        fechaInicio={fechaInicio}
        numeroEtapas={etapas.length}
      />
      <CarreraSubnavGenerica tieneGaleria={Boolean(fotosGenericas && fotosGenericas.galeria.length > 0)} />
      <CarreraMallaGenerica duracionMeses={carrera.duracionMeses} />
      {fotosGenericas && fotosGenericas.galeria.length > 0 && (
        <CarreraGaleriaGenerica fotos={fotosGenericas.galeria} />
      )}
      <CarreraCTAFinalGenerica nombre={carrera.nombre} />
    </main>
  );
}
