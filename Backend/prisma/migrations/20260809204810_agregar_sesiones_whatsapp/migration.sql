-- CreateTable
CREATE TABLE "sesiones_whatsapp" (
    "id" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "historial" JSONB NOT NULL,
    "ultima_actividad" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sesiones_whatsapp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sesiones_whatsapp_telefono_key" ON "sesiones_whatsapp"("telefono");
