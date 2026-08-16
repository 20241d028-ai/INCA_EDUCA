import { Request, Response } from "express";
import multer from "multer";

import {
  generarRespuestaAgente,
  escalarConversacion,
  listarConversaciones,
  obtenerConversacion,
} from "./service";

const upload = multer({ storage: multer.memoryStorage() });
export const uploadAudioMiddleware = upload.single("audio");

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

export async function postMensajeAudio(req: Request, res: Response) {
  if (!req.file) {
    return res.status(400).json({ error: "No se recibió ningún audio" });
  }

  let historial;
  try {
    historial = JSON.parse(req.body.historial || "[]");
  } catch {
    return res.status(400).json({ error: "Historial inválido" });
  }

  try {
    const formData = new FormData();
    const audioBlob = new Blob([new Uint8Array(req.file.buffer)], { type: req.file.mimetype });
    formData.append("audio", audioBlob, "audio.webm");

    const sttResponse = await fetch(`${process.env.STT_SERVICE_URL}/transcribir`, {
      method: "POST",
      body: formData,
    });
    if (!sttResponse.ok) throw new Error("Fallo el servicio de transcripción");
    const { texto } = await sttResponse.json();

    const nuevoHistorial = [...historial, { remitente: "postulante", contenido: texto }];
    const respuesta = await generarRespuestaAgente(nuevoHistorial);

    const ttsResponse = await fetch(`${process.env.STT_SERVICE_URL}/generar-audio`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto: respuesta }),
    });
    if (!ttsResponse.ok) throw new Error("Fallo el servicio de texto a voz");
    const audioArrayBuffer = await ttsResponse.arrayBuffer();
    const respuestaAudioBase64 = Buffer.from(audioArrayBuffer).toString("base64");

    res.json({ textoTranscrito: texto, respuesta, respuestaAudioBase64 });
  } catch (error) {
    console.error("Error en mensaje de audio:", error);
    res.status(502).json({ error: "No se pudo procesar el audio en este momento" });
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