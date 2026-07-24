import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const carreras = [
  { nombre: "Gastronomía Internacional", slug: "gastronomia-internacional", duracionMeses: 18 },
  { nombre: "Panadería y Pastelería Industrial", slug: "panaderia-y-pasteleria-industrial", duracionMeses: 18 },
  { nombre: "Hostelería y Turismo", slug: "hosteleria-y-turismo", duracionMeses: 18 },
  { nombre: "Cosmetología y Estética Personal", slug: "cosmetologia-y-estetica-personal", duracionMeses: 18 },
  { nombre: "Asistente Administrativo, Logística y Almacén", slug: "asistente-administrativo-logistica-almacen", duracionMeses: 18 },
  { nombre: "Operador de Computadoras", slug: "operador-de-computadoras", duracionMeses: 18 },
];

async function main() {
  for (const carrera of carreras) {
    await prisma.carrera.upsert({
      where: { slug: carrera.slug },
      update: {},
      create: carrera,
    });
  }
  console.log("Carreras insertadas correctamente");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });