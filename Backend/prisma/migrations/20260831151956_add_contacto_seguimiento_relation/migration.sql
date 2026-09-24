-- DropForeignKey
ALTER TABLE "seguimientos" DROP CONSTRAINT "seguimientos_postulante_id_fkey";

-- AlterTable
ALTER TABLE "seguimientos" ADD COLUMN     "contacto_id" TEXT,
ALTER COLUMN "postulante_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "seguimientos" ADD CONSTRAINT "seguimientos_postulante_id_fkey" FOREIGN KEY ("postulante_id") REFERENCES "postulantes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguimientos" ADD CONSTRAINT "seguimientos_contacto_id_fkey" FOREIGN KEY ("contacto_id") REFERENCES "contactos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
