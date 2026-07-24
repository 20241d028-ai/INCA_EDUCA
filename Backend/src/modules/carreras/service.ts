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