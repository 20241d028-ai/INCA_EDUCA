import { Request, Response } from "express";
import {
  listarNotificaciones,
  contarNoLeidas,
  marcarNotificacionLeida,
  marcarTodasLeidas,
} from "./service";

function parseLeido(valor: unknown): boolean | undefined {
  if (valor === "true") return true;
  if (valor === "false") return false;
  return undefined;
}

export async function getNotificaciones(req: Request, res: Response) {
  const leido = parseLeido(req.query.leido);
  const notificaciones = await listarNotificaciones(leido);
  res.json(notificaciones);
}

export async function getContadorNoLeidas(_req: Request, res: Response) {
  const total = await contarNoLeidas();
  res.json({ total });
}

export async function patchMarcarLeida(req: Request<{ id: string }>, res: Response) {
  try {
    const notificacion = await marcarNotificacionLeida(req.params.id);
    res.json(notificacion);
  } catch (error) {
    res.status(404).json({ error: "Notificación no encontrada" });
  }
}

export async function patchMarcarTodasLeidas(_req: Request, res: Response) {
  const resultado = await marcarTodasLeidas();
  res.json({ actualizadas: resultado.count });
}
