import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@incaeduca.edu.pe";
  const passwordPlano = "cambiar123"; // cámbiala después de la primera prueba
  const passwordHash = await bcrypt.hash(passwordPlano, 10);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: {},
    create: {
      nombre: "Administrador INCA EDUCA",
      email,
      passwordHash,
    },
  });

  console.log("Admin creado:", admin.email);
}

main().finally(() => prisma.$disconnect());