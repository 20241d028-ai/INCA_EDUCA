import { prisma } from "../../prisma";
import { EstadoPostulante, OrigenPostulante } from "@prisma/client";

interface CrearPostulanteInput {
  nombreApellido: string;
  dni: string;
  celular: string;
  carreraId: string;
  origen: OrigenPostulante;
  consentimientoDatos: boolean;
}

export async function crearPostulante(data: CrearPostulanteInput) {
  return prisma.postulante.create({
    data: {
      nombreApellido: data.nombreApellido,
      dni: data.dni,
      celular: data.celular,
      carreraId: data.carreraId,
      origen: data.origen,
      consentimientoDatos: data.consentimientoDatos,
    },
  });
}

export async function listarPostulantes(estado?: EstadoPostulante) {
  return prisma.postulante.findMany({
    where: estado ? { estado } : undefined,
    include: { carrera: true },
    orderBy: { fechaRegistro: "desc" },
  });
}

export async function obtenerPostulantePorId(id: string) {
  return prisma.postulante.findUnique({
    where: { id },
    include: { carrera: true, conversacion: true },
  });
}

export async function actualizarEstadoPostulante(id: string, estado: EstadoPostulante) {
  return prisma.postulante.update({
    where: { id },
    data: { estado },
  });
}