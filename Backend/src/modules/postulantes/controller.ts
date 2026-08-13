import { Request, Response } from "express";
import {
  crearPostulante,
  listarPostulantes,
  obtenerPostulantePorId,
  actualizarEstadoPostulante,
  listarPendientesRecordatorio,
} from "./service";
import { EstadoPostulante, OrigenPostulante } from "@prisma/client";

const DNI_REGEX = /^\d{8}$/;
const CELULAR_REGEX = /^\d{9}$/;

export async function postCrearPostulante(req: Request, res: Response) {
  const { nombreApellido, dni, celular, carreraId, origen, consentimientoDatos } = req.body;

  if (!nombreApellido || !dni || !celular || !carreraId) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }
  if (!DNI_REGEX.test(dni)) {
    return res.status(400).json({ error: "El DNI debe tener 8 dígitos" });
  }
  if (!CELULAR_REGEX.test(celular)) {
    return res.status(400).json({ error: "El celular debe tener 9 dígitos" });
  }
  if (!consentimientoDatos) {
    return res.status(400).json({ error: "Se requiere el consentimiento de datos personales" });
  }

  try {
    const postulante = await crearPostulante({
      nombreApellido,
      dni,
      celular,
      carreraId,
      origen: origen === "chatbot" ? OrigenPostulante.chatbot : OrigenPostulante.formulario,
      consentimientoDatos,
    });

    // Dispara la automatización de WhatsApp en n8n (no bloqueante:
    // si n8n falla o está caído, no debe afectar la creación del postulante)
    if (process.env.N8N_WEBHOOK_URL) {
      fetch(process.env.N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postulanteId: postulante.id,
          nombre: postulante.nombreApellido,
          telefono: `51${postulante.celular}`,
          carrera: postulante.carrera.nombre,
        }),
      }).catch((err) => {
        console.error("No se pudo notificar a n8n:", err);
      });
    }

    res.status(201).json(postulante);
  } catch (error) {
    res.status(400).json({ error: "No se pudo registrar el postulante. Verifica el carreraId." });
  }
}

export async function getPostulantes(req: Request, res: Response) {
  const estado = req.query.estado as EstadoPostulante | undefined;
  const postulantes = await listarPostulantes(estado);
  res.json(postulantes);
}

export async function getPostulantePorId(req: Request<{ id: string }>, res: Response) {
  const postulante = await obtenerPostulantePorId(req.params.id);
  if (!postulante) {
    return res.status(404).json({ error: "Postulante no encontrado" });
  }
  res.json(postulante);
}

export async function patchEstadoPostulante(req: Request<{ id: string }>, res: Response) {
  const { estado } = req.body;
  if (!Object.values(EstadoPostulante).includes(estado)) {
    return res.status(400).json({ error: "Estado inválido" });
  }
  const postulante = await actualizarEstadoPostulante(req.params.id, estado);
  res.json(postulante);
}

export async function getPendientesRecordatorio(req: Request, res: Response) {
  const secretoRecibido = req.headers["x-webhook-secret"];
  if (secretoRecibido !== process.env.N8N_WEBHOOK_SECRET) {
    return res.status(401).json({ error: "Secreto de webhook inválido" });
  }

  const pendientes = await listarPendientesRecordatorio();
  res.json(pendientes);
}