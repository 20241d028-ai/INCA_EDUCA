import { prisma } from "../../prisma";
import { generarRespuestaAgente } from "../chat/service";

const TIEMPO_EXPIRACION_MS = 30 * 60 * 1000; // 30 minutos

interface MensajeHistorial {
  remitente: "postulante" | "agente";
  contenido: string;
}

export async function procesarMensajeWhatsapp(telefono: string, textoUsuario: string) {
  const sesionExistente = await prisma.sesionWhatsapp.findUnique({ where: { telefono } });

  const ahora = new Date();
  let historial: MensajeHistorial[] = [];
  let avisoExpiracion = false;

  if (sesionExistente) {
    const tiempoTranscurrido = ahora.getTime() - sesionExistente.ultimaActividad.getTime();
    if (tiempoTranscurrido > TIEMPO_EXPIRACION_MS) {
      avisoExpiracion = true;
      historial = [];
    } else {
      historial = sesionExistente.historial as unknown as MensajeHistorial[];
    }
  }

  historial.push({ remitente: "postulante", contenido: textoUsuario });

  const respuesta = await generarRespuestaAgente(historial, "whatsapp");

  historial.push({ remitente: "agente", contenido: respuesta });

  await prisma.sesionWhatsapp.upsert({
    where: { telefono },
    create: { telefono, historial: historial as any, ultimaActividad: ahora },
    update: { historial: historial as any, ultimaActividad: ahora },
  });

  return { respuesta, avisoExpiracion };
}