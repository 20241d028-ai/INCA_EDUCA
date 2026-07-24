import { Request, Response } from "express";
import {
  generarRespuestaAgente,
  escalarConversacion,
  listarConversaciones,
  obtenerConversacion,
} from "./service";

export async function postMensaje(req: Request, res: Response) {
  const { historial } = req.body;
  if (!Array.isArray(historial) || historial.length === 0) {
    return res.status(400).json({ error: "Se requiere el historial de la conversación" });
  }

  try {
    const respuesta = await generarRespuestaAgente(historial);
    res.json({ respuesta });
  } catch (error) {
    console.error("Error del agente conversacional:", error);
    res.status(502).json({ error: "El agente conversacional no está disponible en este momento" });
  }
}

export async function postEscalar(req: Request, res: Response) {
  const { postulanteId, historial } = req.body;
  if (!postulanteId || !Array.isArray(historial)) {
    return res.status(400).json({ error: "Faltan datos para escalar la conversación" });
  }

  const conversacion = await escalarConversacion(postulanteId, historial);
  res.status(201).json(conversacion);
}

export async function getConversaciones(_req: Request, res: Response) {
  res.json(await listarConversaciones());
}

export async function getConversacionPorId(req: Request<{ id: string }>, res: Response) {
  const conversacion = await obtenerConversacion(req.params.id);
  if (!conversacion) return res.status(404).json({ error: "Conversación no encontrada" });
  res.json(conversacion);
}