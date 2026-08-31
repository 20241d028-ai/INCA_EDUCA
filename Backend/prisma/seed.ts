import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Lista actualizada (2026-08-13). Duraciones en meses.
// "Computación e Informática": duración no especificada en la fuente original,
// se asumió 12 meses (igual al resto de carreras cortas) — confirmar con dirección académica.
const carreras = [
  { nombre: "Cosmetología y Barbería", slug: "cosmetologia-y-estetica-personal", duracionMeses: 16, imagenUrl: null },
  { nombre: "Computación e Informática", slug: "operador-de-computadoras", duracionMeses: 12, imagenUrl: null },
  { nombre: "Panadería y Pastelería", slug: "panaderia-y-pasteleria-industrial", duracionMeses: 12 },
  { nombre: "Gastronomía Internacional", slug: "gastronomia-internacional", duracionMeses: 12 },
  { nombre: "Logística y Almacén", slug: "logistica-y-almacen", duracionMeses: 12, imagenUrl: null },
  { nombre: "Asistente Contable", slug: "asistente-contable", duracionMeses: 12, imagenUrl: null },
  { nombre: "Apoyo Administrativo", slug: "apoyo-administrativo", duracionMeses: 12, imagenUrl: null },
  { nombre: "Hostelería y Turismo", slug: "hosteleria-y-turismo", duracionMeses: 12 },
];

// NOTA / PENDIENTE:
// La carrera legacy "Asistente Administrativo, Logística y Almacén"
// (slug: asistente-administrativo-logistica-almacen) ya NO forma parte de la
// oferta vigente: se reemplaza por "Logística y Almacén", "Asistente Contable"
// y "Apoyo Administrativo" como carreras independientes. Este seed no la borra
// automáticamente porque puede tener postulantes ya vinculados por FK
// (carreraId en Postulante). Antes de eliminarla en la BD real, revisar si
// tiene postulantes asociados y decidir si se conserva solo como histórico.

async function main() {
  for (const carrera of carreras) {
    await prisma.carrera.upsert({
      where: { slug: carrera.slug },
      update: {
        nombre: carrera.nombre,
        duracionMeses: carrera.duracionMeses,
        ...("imagenUrl" in carrera ? { imagenUrl: carrera.imagenUrl } : {}),
      },
      create: carrera,
    });
  }
  console.log("Carreras insertadas/actualizadas correctamente");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
