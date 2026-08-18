/*
  Warnings:

  - You are about to drop the `notificaciones` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "notificaciones" DROP CONSTRAINT "notificaciones_admin_id_fkey";

-- DropTable
DROP TABLE "notificaciones";

-- DropEnum
DROP TYPE "TipoNotificacion";
