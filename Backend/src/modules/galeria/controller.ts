import { Request, Response } from "express";
import {
  subirACloudinary,
  crearGaleria,
  listarGaleria,
  obtenerGaleriaPorId,
  eliminarGaleria,
} from "./service";
import { TipoGaleria } from "@prisma/client";
import { AuthRequest } from "../../middleware/auth";

export async function postSubirGaleria(req: AuthRequest, res: Response) {
  const { titulo, evento, tipo } = req.body;
  const archivo = req.file;

  if (!archivo) {
    return res.status(400).json({ error: "Se requiere un archivo (campo 'archivo')" });
  }
  if (!titulo || !evento || !tipo) {
    return res.status(400).json({ error: "Faltan campos obligatorios: titulo, evento, tipo" });
  }
  if (!Object.values(TipoGaleria).includes(tipo)) {
    return res.status(400).json({ error: "Tipo inválido (debe ser 'foto' o 'video')" });
  }
  if (!req.adminId) {
    return res.status(401).json({ error: "No autorizado" });
  }

  try {
    const { url } = await subirACloudinary({
      buffer: archivo.buffer,
      mimetype: archivo.mimetype,
      tipo,
    });

    const item = await crearGaleria({
      tipo,
      url,
      titulo,
      evento,
      adminId: req.adminId,
    });

    res.status(201).json(item);
  } catch (error) {
    console.error("Error al subir a Cloudinary:", error);
    res.status(502).json({ error: "No se pudo subir el archivo al almacenamiento en la nube" });
  }
}

export async function getGaleria(req: Request, res: Response) {
  const tipo = req.query.tipo as TipoGaleria | undefined;
  const items = await listarGaleria(tipo);
  res.json(items);
}

export async function getGaleriaPorId(req: Request<{ id: string }>, res: Response) {
  const item = await obtenerGaleriaPorId(req.params.id);
  if (!item) {
    return res.status(404).json({ error: "Elemento de galería no encontrado" });
  }
  res.json(item);
}

export async function deleteGaleriaPorId(req: Request<{ id: string }>, res: Response) {
  const item = await eliminarGaleria(req.params.id);
  if (!item) {
    return res.status(404).json({ error: "Elemento de galería no encontrado" });
  }
  res.json({ mensaje: "Elemento eliminado correctamente" });
}
