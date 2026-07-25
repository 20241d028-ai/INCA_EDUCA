import { prisma } from "../../prisma";
import { TipoGaleria } from "@prisma/client";
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
  url: string;
  titulo: string;
  evento: string;
  adminId: string;
}

export async function crearGaleria(data: CrearGaleriaInput) {
  return prisma.galeria.create({ data });
}

export async function listarGaleria(tipo?: TipoGaleria) {
  return prisma.galeria.findMany({
    where: tipo ? { tipo } : undefined,
    orderBy: { fechaSubida: "desc" },
  });
}

export async function obtenerGaleriaPorId(id: string) {
  return prisma.galeria.findUnique({ where: { id } });
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
