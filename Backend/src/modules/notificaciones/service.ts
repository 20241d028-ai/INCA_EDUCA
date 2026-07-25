import { prisma } from "../../prisma";
import { TipoNotificacion } from "@prisma/client";

interface CrearNotificacionInput {
  tipo: TipoNotificacion;
  referenciaId: string;
  mensaje: string;
  adminId?: string;
}

export async function crearNotificacion(data: CrearNotificacionInput) {
  return prisma.notificacion.create({
    data: {
      tipo: data.tipo,
      referenciaId: data.referenciaId,
      mensaje: data.mensaje,
      adminId: data.adminId,
    },
  });
}

export async function listarNotificaciones(leido?: boolean) {
  return prisma.notificacion.findMany({
    where: leido !== undefined ? { leido } : undefined,
    orderBy: { fechaCreacion: "desc" },
  });
}

export async function contarNoLeidas() {
  return prisma.notificacion.count({ where: { leido: false } });
}

export async function marcarNotificacionLeida(id: string) {
  return prisma.notificacion.update({
    where: { id },
    data: { leido: true },
  });
}

export async function marcarTodasLeidas() {
  return prisma.notificacion.updateMany({
    where: { leido: false },
    data: { leido: true },
  });
}
