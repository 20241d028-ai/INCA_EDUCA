-- CreateEnum
CREATE TYPE "OrigenPostulante" AS ENUM ('formulario', 'chatbot');

-- CreateEnum
CREATE TYPE "EstadoPostulante" AS ENUM ('nuevo', 'contactado', 'en_seguimiento', 'matriculado', 'descartado');

-- CreateEnum
CREATE TYPE "EstadoConversacion" AS ENUM ('activa', 'escalada', 'cerrada');

-- CreateEnum
CREATE TYPE "RemitenteMensaje" AS ENUM ('postulante', 'agente');

-- CreateEnum
CREATE TYPE "TipoMensaje" AS ENUM ('texto', 'audio');

-- CreateEnum
CREATE TYPE "CanalSeguimiento" AS ENUM ('whatsapp', 'correo');

-- CreateEnum
CREATE TYPE "EstadoSeguimiento" AS ENUM ('enviado', 'fallido', 'reintentando');

-- CreateEnum
CREATE TYPE "TipoGaleria" AS ENUM ('foto', 'video');

-- CreateEnum
CREATE TYPE "TipoNotificacion" AS ENUM ('nuevo_postulante', 'escalamiento');

-- CreateTable
CREATE TABLE "carreras" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "duracion_meses" INTEGER NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "carreras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "postulantes" (
    "id" TEXT NOT NULL,
    "nombre_apellido" TEXT NOT NULL,
    "dni" VARCHAR(8) NOT NULL,
    "celular" VARCHAR(9) NOT NULL,
    "carrera_id" TEXT NOT NULL,
    "estado" "EstadoPostulante" NOT NULL DEFAULT 'nuevo',
    "origen" "OrigenPostulante" NOT NULL,
    "consentimiento_datos" BOOLEAN NOT NULL DEFAULT false,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "postulantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversaciones" (
    "id" TEXT NOT NULL,
    "postulante_id" TEXT NOT NULL,
    "estado" "EstadoConversacion" NOT NULL DEFAULT 'escalada',
    "fecha_escalamiento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mensajes" (
    "id" TEXT NOT NULL,
    "conversacion_id" TEXT NOT NULL,
    "remitente" "RemitenteMensaje" NOT NULL,
    "tipo" "TipoMensaje" NOT NULL DEFAULT 'texto',
    "contenido" TEXT NOT NULL,
    "enviado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mensajes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seguimientos" (
    "id" TEXT NOT NULL,
    "postulante_id" TEXT NOT NULL,
    "admin_id" TEXT,
    "canal" "CanalSeguimiento" NOT NULL,
    "estado" "EstadoSeguimiento" NOT NULL DEFAULT 'enviado',
    "fecha_envio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seguimientos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "galeria" (
    "id" TEXT NOT NULL,
    "tipo" "TipoGaleria" NOT NULL,
    "url" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "evento" TEXT NOT NULL,
    "admin_id" TEXT NOT NULL,
    "fecha_subida" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "galeria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificaciones" (
    "id" TEXT NOT NULL,
    "tipo" "TipoNotificacion" NOT NULL,
    "referencia_id" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "leido" BOOLEAN NOT NULL DEFAULT false,
    "admin_id" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "carreras_slug_key" ON "carreras"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "conversaciones_postulante_id_key" ON "conversaciones"("postulante_id");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- AddForeignKey
ALTER TABLE "postulantes" ADD CONSTRAINT "postulantes_carrera_id_fkey" FOREIGN KEY ("carrera_id") REFERENCES "carreras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversaciones" ADD CONSTRAINT "conversaciones_postulante_id_fkey" FOREIGN KEY ("postulante_id") REFERENCES "postulantes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensajes" ADD CONSTRAINT "mensajes_conversacion_id_fkey" FOREIGN KEY ("conversacion_id") REFERENCES "conversaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguimientos" ADD CONSTRAINT "seguimientos_postulante_id_fkey" FOREIGN KEY ("postulante_id") REFERENCES "postulantes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguimientos" ADD CONSTRAINT "seguimientos_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "galeria" ADD CONSTRAINT "galeria_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
