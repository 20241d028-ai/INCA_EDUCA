import { Request, Response } from "express";
import { registrarSeguimiento } from "./service";
import { CanalSeguimiento, EstadoSeguimiento } from "@prisma/client";

export async function postSeguimiento(req: Request, res: Response) {
  const { postulanteId, canal, estado, adminId } = req.body;

  if (!postulanteId || !canal || !estado) {
    return res.status(400).json({ error: "Faltan campos obligatorios: postulanteId, canal, estado" });
  }

  if (!Object.values(CanalSeguimiento).includes(canal)) {
    return res.status(400).json({ error: "Canal inválido (debe ser 'whatsapp' o 'correo')" });
  }

  if (!Object.values(EstadoSeguimiento).includes(estado)) {
    return res.status(400).json({ error: "Estado inválido (enviado, fallido o reintentando)" });
  }

  try {
    const seguimiento = await registrarSeguimiento({ postulanteId, canal, estado, adminId });
    res.status(201).json(seguimiento);
  } catch (error) {
    res.status(400).json({ error: "No se pudo registrar el seguimiento. Verifica el postulanteId." });
  }
}