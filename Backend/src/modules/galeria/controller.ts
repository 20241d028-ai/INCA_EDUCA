import { Request, Response } from "express";
import {
  subirACloudinary,
  crearGaleria,
  listarGaleria,
  obtenerGaleriaPorId,
  actualizarGaleria,
  eliminarGaleria,
} from "./service";
import { TipoGaleria, CategoriaGaleria } from "@prisma/client";
import { AuthRequest } from "../../middleware/auth";

function aBooleano(valor: unknown): boolean | undefined {
  if (valor === undefined) return undefined;
  return valor === true || valor === "true" || valor === "1" || valor === 1;
}

function aEntero(valor: unknown): number | undefined {
  if (valor === undefined || valor === "") return undefined;
  const n = Number(valor);
  return Number.isFinite(n) ? Math.trunc(n) : undefined;
}

export async function postSubirGaleria(req: AuthRequest, res: Response) {
  const { titulo, evento, tipo, categoria, destacado, orden } = req.body;
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
  if (categoria && !Object.values(CategoriaGaleria).includes(categoria)) {
    return res.status(400).json({ error: "Categoría inválida" });
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
      categoria: categoria || undefined,
      url,
      titulo,
      evento,
      destacado: aBooleano(destacado) ?? false,
      orden: aEntero(orden) ?? 0,
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
  const categoria = req.query.categoria as CategoriaGaleria | undefined;
  const soloDestacados = req.query.destacados === "true";
  // Endpoint público: solo devuelve elementos activos.
  const items = await listarGaleria({ tipo, categoria, soloActivos: true, soloDestacados });
  res.json(items);
}

// Endpoint de administración: ve también los elementos inactivos.
export async function getGaleriaAdmin(_req: AuthRequest, res: Response) {
  const items = await listarGaleria({ soloActivos: false });
  res.json(items);
}

export async function getGaleriaPorId(req: Request<{ id: string }>, res: Response) {
  const item = await obtenerGaleriaPorId(req.params.id);
  if (!item) {
    return res.status(404).json({ error: "Elemento de galería no encontrado" });
  }
  res.json(item);
}

export async function patchGaleriaPorId(req: Request<{ id: string }>, res: Response) {
  const { titulo, evento, categoria, activo, destacado, orden } = req.body;

  if (categoria && !Object.values(CategoriaGaleria).includes(categoria)) {
    return res.status(400).json({ error: "Categoría inválida" });
  }

  const item = await actualizarGaleria(req.params.id, {
    ...(titulo !== undefined ? { titulo } : {}),
    ...(evento !== undefined ? { evento } : {}),
    ...(categoria !== undefined ? { categoria: categoria || null } : {}),
    ...(aBooleano(activo) !== undefined ? { activo: aBooleano(activo) } : {}),
    ...(aBooleano(destacado) !== undefined ? { destacado: aBooleano(destacado) } : {}),
    ...(aEntero(orden) !== undefined ? { orden: aEntero(orden) } : {}),
  });

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
