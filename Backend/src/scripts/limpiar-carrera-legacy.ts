/**
 * Revisa (y opcionalmente elimina) la carrera legacy que quedó fuera de la
 * oferta vigente tras la actualización de carreras del 2026-08-13:
 * "Asistente Administrativo, Logística y Almacén" (slug:
 * asistente-administrativo-logistica-almacen), reemplazada por "Logística y
 * Almacén", "Asistente Contable" y "Apoyo Administrativo" como carreras
 * independientes.
 *
 * El seed (prisma/seed.ts) solo hace upsert, nunca borra filas que ya no
 * están en su lista — por eso esta carrera sigue viva en la BD y sigue
 * apareciendo en GET /api/carreras junto con las 8 nuevas.
 *
 * Este script:
 *  1. Busca la carrera por slug.
 *  2. Cuenta cuántos postulantes están vinculados a ella (FK carreraId).
 *  3. Si tiene postulantes, los reasigna a la carrera nueva "Logística y
 *     Almacén" (slug: logistica-y-almacen) — decisión tomada el 2026-08-13.
 *  4. Elimina la carrera legacy.
 *
 * Uso:
 *   cd Backend
 *   npx ts-node src/scripts/limpiar-carrera-legacy.ts
 */
import dotenv from "dotenv";
dotenv.config();

import { prisma } from "../prisma";

const SLUG_LEGACY = "asistente-administrativo-logistica-almacen";
const SLUG_DESTINO = "logistica-y-almacen";

async function main() {
  const carrera = await prisma.carrera.findUnique({
    where: { slug: SLUG_LEGACY },
  });

  if (!carrera) {
    console.log(`No existe ninguna carrera con slug "${SLUG_LEGACY}". Nada que hacer.`);
    return;
  }

  const totalPostulantes = await prisma.postulante.count({
    where: { carreraId: carrera.id },
  });

  console.log(`Carrera encontrada: "${carrera.nombre}" (id: ${carrera.id})`);
  console.log(`Postulantes vinculados: ${totalPostulantes}`);

  if (totalPostulantes > 0) {
    const destino = await prisma.carrera.findUnique({ where: { slug: SLUG_DESTINO } });
    if (!destino) {
      throw new Error(
        `No existe la carrera destino "${SLUG_DESTINO}". Corre el seed (npx prisma db seed) antes de este script.`
      );
    }

    const { count } = await prisma.postulante.updateMany({
      where: { carreraId: carrera.id },
      data: { carreraId: destino.id },
    });
    console.log(`↪️  ${count} postulante(s) reasignado(s) a "${destino.nombre}".`);
  }

  await prisma.carrera.delete({ where: { id: carrera.id } });
  console.log("✅ Carrera legacy eliminada.");
}

main()
  .catch((err) => {
    console.error("\n❌ Falló:");
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
