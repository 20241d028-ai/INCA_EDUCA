import { randomUUID } from "crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma";

// Nota: el modelo Contacto se agregó a schema.prisma pero el cliente de
// Prisma generado en este entorno todavía no fue regenerado (requiere
// `npx prisma generate`, que necesita descargar el engine correcto).
// Por eso este módulo usa $queryRaw/$queryRawUnsafe con parámetros
// (no interpolación de strings) en vez de `prisma.contacto.*`. Es seguro
// frente a inyección SQL y funciona igual contra la tabla "contactos" una
// vez aplicada la migración. Cuando se regenere el cliente, se puede migrar
// este archivo a la API tipada de Prisma si se prefiere.
//
// Actualización: el cliente ya fue regenerado (31/ago) para soportar la
// relación Seguimiento <-> Contacto. listarPendientesRecordatorioContacto()
// usa la API tipada; el resto del archivo se deja con $queryRaw por ahora
// para no arriesgar el flujo que ya está en producción.

export type EstadoContacto = "nuevo" | "atendido";

export interface Contacto {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  motivo: string;
  mensaje: string;
  estado: EstadoContacto;
  creadoEn: Date;
}

interface CrearContactoInput {
  nombre: string;
  correo: string;
  telefono: string;
  motivo: string;
  mensaje: string;
}

export async function crearContacto(data: CrearContactoInput): Promise<Contacto> {
  const id = randomUUID();
  const filas = await prisma.$queryRaw<Contacto[]>(Prisma.sql`
    INSERT INTO "contactos" (id, nombre, correo, telefono, motivo, mensaje, estado, creado_en)
    VALUES (${id}, ${data.nombre}, ${data.correo}, ${data.telefono}, ${data.motivo}, ${data.mensaje}, 'nuevo', CURRENT_TIMESTAMP)
    RETURNING id, nombre, correo, telefono, motivo, mensaje, estado, creado_en AS "creadoEn"
  `);
  return filas[0];
}

export async function listarContactos(estado?: EstadoContacto): Promise<Contacto[]> {
  if (estado) {
    return prisma.$queryRaw<Contacto[]>(Prisma.sql`
      SELECT id, nombre, correo, telefono, motivo, mensaje, estado, creado_en AS "creadoEn"
      FROM "contactos"
      WHERE estado = ${estado}
      ORDER BY creado_en DESC
    `);
  }
  return prisma.$queryRaw<Contacto[]>(Prisma.sql`
    SELECT id, nombre, correo, telefono, motivo, mensaje, estado, creado_en AS "creadoEn"
    FROM "contactos"
    ORDER BY creado_en DESC
  `);
}

export async function actualizarEstadoContacto(
  id: string,
  estado: EstadoContacto
): Promise<Contacto | null> {
  const filas = await prisma.$queryRaw<Contacto[]>(Prisma.sql`
    UPDATE "contactos"
    SET estado = ${estado}
    WHERE id = ${id}
    RETURNING id, nombre, correo, telefono, motivo, mensaje, estado, creado_en AS "creadoEn"
  `);
  return filas[0] ?? null;
}

export async function listarPendientesRecordatorioContacto() {
  const UMBRAL_DIAS = [2, 5, 10]; // día en que corresponde el recordatorio N (índice 0 = recordatorio 1)
  const MAX_RECORDATORIOS = 3;

  const candidatos = await prisma.contacto.findMany({
    where: { estado: "nuevo" },
    include: {
      seguimientos: { where: { canal: "whatsapp" }, orderBy: { fechaEnvio: "asc" } },
    },
  });

  const ahora = new Date();

  return candidatos
    .map((c) => {
      const recordatoriosEnviados = Math.max(c.seguimientos.length - 1, 0);
      if (recordatoriosEnviados >= MAX_RECORDATORIOS) return null;

      const diasTranscurridos = Math.floor(
        (ahora.getTime() - c.creadoEn.getTime()) / (1000 * 60 * 60 * 24)
      );
      const diasRequeridos = UMBRAL_DIAS[recordatoriosEnviados];

      if (diasTranscurridos < diasRequeridos) return null;

      return {
        contactoId: c.id,
        nombre: c.nombre,
        telefono: c.telefono,
        motivo: c.motivo,
        numeroRecordatorio: recordatoriosEnviados + 1,
      };
    })
    .filter((x) => x !== null);
}