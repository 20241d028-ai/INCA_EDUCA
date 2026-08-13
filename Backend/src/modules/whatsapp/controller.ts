import { Request, Response } from "express";
import { procesarMensajeWhatsapp } from "./service";

export async function postMensajeWhatsapp(req: Request, res: Response) {
  const secretoRecibido = req.headers["x-webhook-secret"];
  if (secretoRecibido !== process.env.N8N_WEBHOOK_SECRET) {
    return res.status(401).json({ error: "Secreto de webhook inválido" });
  }

  const { telefono, texto } = req.body;

  if (!telefono || !texto) {
    return res.status(400).json({ error: "Faltan campos: telefono, texto" });
  }

  try {
    const resultado = await procesarMensajeWhatsapp(telefono, texto);
    res.json(resultado);
  } catch (error) {
    console.error("Error procesando mensaje de WhatsApp:", error);
    res.status(502).json({ error: "El agente conversacional no está disponible en este momento" });
  }
}