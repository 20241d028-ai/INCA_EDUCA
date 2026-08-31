import { IconGraduationCap, IconWrench, IconMegaphone, IconMapPin } from "@/components/ui/Icons";

// Debe coincidir con el enum CategoriaGaleria de Backend/prisma/schema.prisma.
export type CategoriaGaleria =
  | "actividades_academicas"
  | "talleres_practicas"
  | "eventos_institucionales"
  | "nuestros_espacios";

export const CATEGORIAS_GALERIA: CategoriaGaleria[] = [
  "actividades_academicas",
  "talleres_practicas",
  "eventos_institucionales",
  "nuestros_espacios",
];

export const CATEGORIA_GALERIA_META: Record<
  CategoriaGaleria,
  { etiqueta: string; icono: typeof IconMapPin }
> = {
  actividades_academicas: { etiqueta: "INCA EDUCA", icono: IconGraduationCap },
  talleres_practicas: { etiqueta: "GRADUACIONES", icono: IconWrench },
  eventos_institucionales: { etiqueta: "ACTIVIDADES", icono: IconMegaphone },
  nuestros_espacios: { etiqueta: "NUESTROS ESTUDIANTES", icono: IconMapPin },
};

export interface GaleriaItem {
  id: string;
  tipo: "foto" | "video";
  categoria: CategoriaGaleria | null;
  url: string;
  titulo: string;
  evento: string;
  activo: boolean;
  destacado: boolean;
  orden: number;
  fechaSubida: string;
}

// Configuración de los 4 carruseles por categoría de la Galería pública.
// Nota: las claves del enum (heredadas del modelo original) no coinciden
// literalmente con su etiqueta actual — ver CATEGORIA_GALERIA_META arriba,
// ya renombrada a pedido. Este arreglo define el ORDEN y los textos de cada
// carrusel institucional, reutilizando la misma categoría del backend.
export interface CarruselGaleriaConfig {
  categoria: CategoriaGaleria;
  titulo: string;
  descripcion: string;
}

// El titulo de cada carrusel usa la MISMA etiqueta visible que ya se
// muestra en el resto del sitio (CATEGORIA_GALERIA_META), para que la
// Galeria se lea como secciones institucionales claras (INCA EDUCA,
// GRADUACIONES, ACTIVIDADES, NUESTROS ESTUDIANTES) en vez de titulos
// libres. Son solo textos de presentacion: no se guardan en la BD.
export const CARRUSELES_GALERIA: CarruselGaleriaConfig[] = [
  {
    categoria: "actividades_academicas", // etiqueta: INCA EDUCA
    titulo: "INCA EDUCA",
    descripcion: "Conoce a quienes forman parte de nuestra comunidad educativa.",
  },
  {
    categoria: "talleres_practicas", // etiqueta: GRADUACIONES
    titulo: "GRADUACIONES",
    descripcion: "Celebramos el esfuerzo y los logros de nuestros estudiantes.",
  },
  {
    categoria: "eventos_institucionales", // etiqueta: ACTIVIDADES
    titulo: "ACTIVIDADES",
    descripcion: "Experiencias que fortalecen nuestra formación y comunidad.",
  },
  {
    categoria: "nuestros_espacios", // etiqueta: NUESTROS ESTUDIANTES
    titulo: "NUESTROS ESTUDIANTES",
    descripcion: "Momentos y experiencias de nuestros estudiantes.",
  },
];

export const DESTACADOS_GALERIA = {
  titulo: "Momentos que quedan",
  descripcion: "Cada actividad, cada logro y cada experiencia forma parte de nuestra historia.",
};
