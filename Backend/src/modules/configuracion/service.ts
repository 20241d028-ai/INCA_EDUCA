import { prisma } from "../../prisma";

const ID_CONFIGURACION = "general";

// Fila única (id fijo "general") con ajustes del sitio que no pertenecen a
// ninguna otra tabla, como la fecha de inicio de clases institucional que
// se muestra en la sección de inicio (distinta de Carrera.fechaInicio, que
// es por carrera).
export async function obtenerConfiguracion() {
  const config = await prisma.configuracionSitio.findUnique({
    where: { id: ID_CONFIGURACION },
  });

  // Si nunca se configuró nada, no existe la fila todavía: se devuelve el
  // valor por defecto (sin fecha) en vez de crear una fila vacía en la BD.
  return config ?? { id: ID_CONFIGURACION, fechaInicioClases: null, actualizadoEn: null };
}

export async function actualizarFechaInicioClases(fechaInicioClases: Date | null) {
  return prisma.configuracionSitio.upsert({
    where: { id: ID_CONFIGURACION },
    create: { id: ID_CONFIGURACION, fechaInicioClases },
    update: { fechaInicioClases },
  });
}
