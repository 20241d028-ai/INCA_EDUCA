import { Request, Response } from "express";
import { registrarSeguimiento } from "./service";
import { CanalSeguimiento, EstadoSeguimiento } from "@prisma/client";

export async function postSeguimiento(req: Request, res: Response) {
  const { postulanteId, contactoId, canal, estado, adminId } = req.body;

  if ((!postulanteId && !contactoId) || (postulanteId && contactoId)) {
    return res.status(400).json({ error: "Debes indicar exactamente uno: postulanteId o contactoId" });
  }
  if (!canal || !estado) {
    return res.status(400).json({ error: "Faltan campos obligatorios: canal, estado" });
  }
  if (!Object.values(CanalSeguimiento).includes(canal)) {
    return res.status(400).json({ error: "Canal inválido (debe ser 'whatsapp' o 'correo')" });
  }
  if (!Object.values(EstadoSeguimiento).includes(estado)) {
    return res.status(400).json({ error: "Estado inválido (enviado, fallido o reintentando)" });
  }

  try {
    const seguimiento = await registrarSeguimiento({ postulanteId, contactoId, canal, estado, adminId });
    res.status(201).json(seguimiento);
  } catch (error) {
    res.status(400).json({ error: "No se pudo registrar el seguimiento. Verifica el id proporcionado." });
  }
}