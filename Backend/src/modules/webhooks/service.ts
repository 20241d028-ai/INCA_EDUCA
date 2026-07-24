import { prisma } from "../../prisma";
import { CanalSeguimiento, EstadoSeguimiento, EstadoPostulante } from "@prisma/client";

interface RegistrarSeguimientoInput {
  postulanteId: string;
  canal: CanalSeguimiento;
  estado: EstadoSeguimiento;
  adminId?: string;
}

export async function registrarSeguimiento(data: RegistrarSeguimientoInput) {
  const seguimiento = await prisma.seguimiento.create({
    data: {
      postulanteId: data.postulanteId,
      canal: data.canal,
      estado: data.estado,
      adminId: data.adminId,
    },
  });

  // Si el envío fue exitoso y el postulante seguía como "nuevo", lo pasamos a "contactado"
  if (data.estado === "enviado") {
    const postulante = await prisma.postulante.findUnique({ where: { id: data.postulanteId } });
    if (postulante?.estado === EstadoPostulante.nuevo) {
      await prisma.postulante.update({
        where: { id: data.postulanteId },
        data: { estado: EstadoPostulante.contactado },
      });
    }
  }

  return seguimiento;
}