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
