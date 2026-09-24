-- CreateTable
CREATE TABLE "configuracion_sitio" (
    "id" TEXT NOT NULL DEFAULT 'general',
    "fecha_inicio_clases" TIMESTAMP(3),
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracion_sitio_pkey" PRIMARY KEY ("id")
);
