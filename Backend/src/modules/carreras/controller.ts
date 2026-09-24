import { Request, Response } from "express";
import { listarCarreras, obtenerCarreraPorSlug, actualizarCarrera } from "./service";
import { AuthRequest } from "../../middleware/auth";

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

// Endpoint de administración: por ahora solo permite editar la fecha de
// inicio de una carrera (lo único que se pidió hacer administrable). Se
// acepta una fecha en formato ISO (yyyy-mm-dd o completo) o null/"" para
// quitarla y volver a "se coordina con un asesor".
export async function patchCarreraPorId(req: AuthRequest, res: Response) {
  const { id } = req.params as { id: string };
  const { fechaInicio } = req.body as { fechaInicio?: string | null };

  let fechaInicioParseada: Date | null | undefined;
  if (fechaInicio === undefined) {
    fechaInicioParseada = undefined;
  } else if (fechaInicio === null || fechaInicio === "") {
    fechaInicioParseada = null;
  } else {
    const fecha = new Date(fechaInicio);
    if (Number.isNaN(fecha.getTime())) {
      return res.status(400).json({ error: "fechaInicio no es una fecha válida" });
    }
    fechaInicioParseada = fecha;
  }

  const carrera = await actualizarCarrera(id, { fechaInicio: fechaInicioParseada });
  if (!carrera) {
    return res.status(404).json({ error: "Carrera no encontrada" });
  }

  res.json(carrera);
}
