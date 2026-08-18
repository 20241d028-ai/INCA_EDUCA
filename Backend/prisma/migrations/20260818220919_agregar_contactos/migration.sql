-- CreateEnum
CREATE TYPE "EstadoContacto" AS ENUM ('nuevo', 'atendido');

-- CreateTable
CREATE TABLE "contactos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "telefono" VARCHAR(9) NOT NULL,
    "motivo" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "estado" "EstadoContacto" NOT NULL DEFAULT 'nuevo',
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contactos_pkey" PRIMARY KEY ("id")
);
