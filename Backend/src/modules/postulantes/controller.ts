import { Request, Response } from "express";
import {
  crearPostulante,
  listarPostulantes,
  obtenerPostulantePorId,
  actualizarEstadoPostulante,
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