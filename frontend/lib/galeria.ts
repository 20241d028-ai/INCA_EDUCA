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

export const CARRUSELES_GALERIA: CarruselGaleriaConfig[] = [
  {
    categoria: "eventos_institucionales", // etiqueta: ACTIVIDADES
    titulo: "Actividades que inspiran",
    descripcion:
      "Descubre las experiencias, talleres y actividades que complementan la formación de nuestros estudiantes.",
  },
  {
    categoria: "nuestros_espacios", // etiqueta: NUESTROS ESTUDIANTES
    titulo: "Nuestros estudiantes",
    descripcion:
      "Cada experiencia forma parte del camino de nuestros estudiantes hacia su desarrollo profesional.",
  },
  {
    categoria: "talleres_practicas", // etiqueta: GRADUACIONES
    titulo: "Celebramos sus logros",
    descripcion:
      "Compartimos algunos de los momentos más importantes de nuestros estudiantes durante su graduación.",
  },
  {
    categoria: "actividades_academicas", // etiqueta: INCA EDUCA
    titulo: "Conoce INCA EDUCA",
    descripcion:
      "Un entorno preparado para acompañar el crecimiento académico y profesional de nuestros estudiantes.",
  },
];

export const DESTACADOS_GALERIA = {
  titulo: "Momentos que quedan",
  descripcion: "Cada actividad, cada logro y cada experiencia forma parte de nuestra historia.",
};
