import { prisma } from "../../prisma";

export async function listarCarreras() {
  return prisma.carrera.findMany({
    orderBy: { nombre: "asc" },
  });
}

export async function obtenerCarreraPorSlug(slug: string) {
  return prisma.carrera.findUnique({
    where: { slug },
  });
}

export async function obtenerCarreraPorId(id: string) {
  return prisma.carrera.findUnique({
    where: { id },
  });
}

interface ActualizarCarreraInput {
  fechaInicio?: Date | null;
}

// Por ahora solo se administra la fecha de inicio (lo único que pidió el
// panel de admin). El resto de campos de la carrera (nombre, duración,
// imagen, descripción) siguen viniendo del seed/semilla de datos y no se
// editan desde aquí para no ampliar el alcance sin que se haya pedido.
export async function actualizarCarrera(id: string, data: ActualizarCarreraInput) {
  const existente = await prisma.carrera.findUnique({ where: { id } });
  if (!existente) return null;

  return prisma.carrera.update({ where: { id }, data });
}
