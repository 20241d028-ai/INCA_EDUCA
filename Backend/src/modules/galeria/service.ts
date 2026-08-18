import { prisma } from "../../prisma";
import { TipoGaleria, CategoriaGaleria } from "@prisma/client";
import cloudinary from "../../lib/cloudinary";

interface SubirArchivoInput {
  buffer: Buffer;
  mimetype: string;
  tipo: TipoGaleria;
}

export async function subirACloudinary({ buffer, mimetype, tipo }: SubirArchivoInput) {
  const dataUri = `data:${mimetype};base64,${buffer.toString("base64")}`;

  const resultado = await cloudinary.uploader.upload(dataUri, {
    folder: "inca-educa/galeria",
    resource_type: tipo === "video" ? "video" : "image",
  });

  return { url: resultado.secure_url, publicId: resultado.public_id };
}

interface CrearGaleriaInput {
  tipo: TipoGaleria;
  categoria?: CategoriaGaleria;
  url: string;
  titulo: string;
  evento: string;
  destacado?: boolean;
  orden?: number;
  adminId: string;
}

export async function crearGaleria(data: CrearGaleriaInput) {
  return prisma.galeria.create({ data });
}

interface ListarGaleriaFiltros {
  tipo?: TipoGaleria;
  categoria?: CategoriaGaleria;
  soloActivos?: boolean;
  soloDestacados?: boolean;
}

export async function listarGaleria(filtros: ListarGaleriaFiltros = {}) {
  const { tipo, categoria, soloActivos = true, soloDestacados = false } = filtros;
  return prisma.galeria.findMany({
    where: {
      ...(tipo ? { tipo } : {}),
      ...(categoria ? { categoria } : {}),
      ...(soloActivos ? { activo: true } : {}),
      ...(soloDestacados ? { destacado: true } : {}),
    },
    orderBy: [{ orden: "asc" }, { fechaSubida: "desc" }],
  });
}

export async function obtenerGaleriaPorId(id: string) {
  return prisma.galeria.findUnique({ where: { id } });
}

interface ActualizarGaleriaInput {
  titulo?: string;
  evento?: string;
  categoria?: CategoriaGaleria | null;
  activo?: boolean;
  destacado?: boolean;
  orden?: number;
}

export async function actualizarGaleria(id: string, data: ActualizarGaleriaInput) {
  const existente = await prisma.galeria.findUnique({ where: { id } });
  if (!existente) return null;

  return prisma.galeria.update({ where: { id }, data });
}

export async function eliminarGaleria(id: string) {
  const item = await prisma.galeria.findUnique({ where: { id } });
  if (!item) return null;

  await prisma.galeria.delete({ where: { id } });

  // Best-effort: también intenta borrar el archivo en Cloudinary (no bloquea si falla)
  try {
    const publicId = extraerPublicId(item.url);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: item.tipo === "video" ? "video" : "image",
      });
    }
  } catch (error) {
    console.error("No se pudo eliminar el archivo de Cloudinary:", error);
  }

  return item;
}

function extraerPublicId(url: string): string | null {
  // Ej: https://res.cloudinary.com/<cloud>/image/upload/v1699999999/inca-educa/galeria/abcxyz.jpg
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  return match ? match[1] : null;
}
