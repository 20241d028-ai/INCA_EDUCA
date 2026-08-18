-- CreateEnum
CREATE TYPE "CategoriaGaleria" AS ENUM ('actividades_academicas', 'talleres_practicas', 'eventos_institucionales', 'nuestros_espacios');

-- AlterTable
ALTER TABLE "galeria" ADD COLUMN     "categoria" "CategoriaGaleria";
