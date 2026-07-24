import { Request, Response } from "express";
import { listarCarreras, obtenerCarreraPorSlug } from "./service";

export async function getCarreras(_req: Request, res: Response) {
  const carreras = await listarCarreras();
  res.json(carreras);
}

export async function getCarreraPorSlug(req: Request<{ slug: string }>, res: Response) {
    const { slug } = req.params;
  const carrera = await obtenerCarreraPorSlug(slug);

  if (!carrera) {
    return res.status(404).json({ error: "Carrera no encontrada" });
  }

  res.json(carrera);
}