import { Response } from "express";
import { obtenerConfiguracion, actualizarFechaInicioClases } from "./service";
import { AuthRequest } from "../../middleware/auth";

export async function getConfiguracion(_req: AuthRequest, res: Response) {
  const config = await obtenerConfiguracion();
  res.json(config);
}

// Endpoint de administración: por ahora solo permite editar la fecha de
// inicio de clases general (lo único administrable de esta configuración).
export async function patchConfiguracion(req: AuthRequest, res: Response) {
  const { fechaInicioClases } = req.body as { fechaInicioClases?: string | null };

  let fechaParseada: Date | null;
  if (fechaInicioClases === null || fechaInicioClases === undefined || fechaInicioClases === "") {
    fechaParseada = null;
  } else {
    const fecha = new Date(fechaInicioClases);
    if (Number.isNaN(fecha.getTime())) {
      return res.status(400).json({ error: "fechaInicioClases no es una fecha válida" });
    }
    fechaParseada = fecha;
  }

  const config = await actualizarFechaInicioClases(fechaParseada);
  res.json(config);
}
