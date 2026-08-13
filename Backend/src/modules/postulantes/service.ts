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
    include: { carrera: true },
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

export async function listarPendientesRecordatorio() {
  const estadosElegibles: EstadoPostulante[] = ["nuevo", "contactado", "en_seguimiento"];

  const candidatos = await prisma.postulante.findMany({
    where: { estado: { in: estadosElegibles } },
    include: {
      carrera: true,
      seguimientos: { where: { canal: "whatsapp" }, orderBy: { fechaEnvio: "asc" } },
    },
  });

  const ahora = new Date();
  const UMBRAL_DIAS = [2, 5, 10]; // día en que corresponde el recordatorio N (índice 0 = recordatorio 1)
  const MAX_RECORDATORIOS = 3;

  return candidatos
    .map((p) => {
      const recordatoriosEnviados = Math.max(p.seguimientos.length - 1, 0);
      if (recordatoriosEnviados >= MAX_RECORDATORIOS) return null;

      const diasTranscurridos = Math.floor(
        (ahora.getTime() - p.fechaRegistro.getTime()) / (1000 * 60 * 60 * 24)
      );
      const diasRequeridos = UMBRAL_DIAS[recordatoriosEnviados];

      if (diasTranscurridos < diasRequeridos) return null;

      return {
        postulanteId: p.id,
        nombre: p.nombreApellido,
        telefono: p.celular,
        carrera: p.carrera.nombre,
        numeroRecordatorio: recordatoriosEnviados + 1,
      };
    })
    .filter((x) => x !== null);
}