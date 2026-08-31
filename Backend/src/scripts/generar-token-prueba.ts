/**
 * Script temporal para generar un JWT de prueba y poder probar en el
 * frontend las rutas protegidas (subir/eliminar galería)
 * mientras el módulo de login real (rama-cristhian) no está fusionado.
 *
 * No toca nada de rama-cristhian: usa el mismo middleware/auth.ts que ya
 * existe en esta rama (jwt.verify con JWT_SECRET), solo firma un token
 * compatible con él.
 *
 * Uso:
 *   cd Backend
 *   npx ts-node src/scripts/generar-token-prueba.ts
 *
 * Copia el token que imprime y pégalo en el campo "Token" del frontend.
 */
import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "../prisma";

const JWT_SECRET = process.env.JWT_SECRET;

async function main() {
  if (!JWT_SECRET) {
    throw new Error(
      "Falta JWT_SECRET en Backend/.env. Agrégalo antes de correr este script."
    );
  }

  let admin = await prisma.admin.findFirst();

  if (!admin) {
    const passwordHash = await bcrypt.hash("cambiar123", 10);
    admin = await prisma.admin.create({
      data: {
        nombre: "Admin de prueba",
        email: "admin-prueba@incaeduca.edu.pe",
        passwordHash,
      },
    });
    console.log(`Admin de prueba creado (${admin.email}) — no existía ninguno todavía.`);
  } else {
    console.log(`Usando admin existente: ${admin.email}`);
  }

  const token = jwt.sign({ adminId: admin.id }, JWT_SECRET, { expiresIn: "7d" });

  console.log("\n✅ Token de prueba (válido 7 días):\n");
  console.log(token);
  console.log("\nPégalo en el campo 'Token' del frontend.");
}

main()
  .catch((err) => {
    console.error("\n❌ Falló:");
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
