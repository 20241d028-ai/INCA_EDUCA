// Contenido visual REAL (fotografías) para las páginas de detalle de las
// carreras que todavía no tienen contenido enriquecido en
// lib/carrerasContenido.ts (todas menos Gastronomía Internacional).
//
// IMPORTANTE: aquí NO se inventa información de la carrera (ni módulos, ni
// cursos, ni cifras). Solo se mapean fotografías REALES ya subidas a la
// Galería de INCA EDUCA (admin/galeria, almacenadas en Cloudinary) hacia la
// carrera con la que están relacionadas por su título/evento real. Cuando
// una carrera no tiene fotos propias en la Galería todavía, se usan fotos
// institucionales generales reales (nunca imágenes generadas o de
// internet), para no dejar la página sin fotografía.
//
// Para agregar una carrera nueva o mejores fotos: sube la foto real desde
// /admin/galeria y agrega aquí su URL de Cloudinary (se puede copiar desde
// la respuesta de GET /api/galeria).

export interface FotoCarrera {
  src: string;
  alt: string;
}

export interface ContenidoGenericoCarrera {
  // Foto principal del hero.
  heroImagen: FotoCarrera;
  // Fotos adicionales para la sección de galería de la carrera (2-3).
  galeria: FotoCarrera[];
}

const FOTO_ESTANDARTES: FotoCarrera = {
  src: "https://res.cloudinary.com/dix9okebs/image/upload/v1790202182/inca-educa/galeria/ltklq4oauvxaiubzfmwi.jpg",
  alt: "Estandartes de las carreras de INCA EDUCA en una actividad institucional en Cusco",
};
const FOTO_BANDERA: FotoCarrera = {
  src: "https://res.cloudinary.com/dix9okebs/image/upload/v1790202201/inca-educa/galeria/t87dljozuf2bktklr1ci.jpg",
  alt: "Estudiantes de INCA EDUCA con la bandera institucional en una actividad en Cusco",
};
const FOTO_DESFILE: FotoCarrera = {
  src: "https://res.cloudinary.com/dix9okebs/image/upload/v1790202145/inca-educa/galeria/cw8rxiiu6cx3klrptlc3.jpg",
  alt: "Desfile con la bandera de INCA EDUCA en la Plaza de Armas del Cusco",
};
const FOTO_DOCENTES: FotoCarrera = {
  src: "https://res.cloudinary.com/dix9okebs/image/upload/v1786746132/inca-educa/galeria/fhygtj4ln4nzu53sp27v.jpg",
  alt: "Docentes destacados de INCA EDUCA",
};
const FOTO_GRADUACION_GENERAL: FotoCarrera = {
  src: "https://res.cloudinary.com/dix9okebs/image/upload/v1790202029/inca-educa/galeria/ncjm4uewzhlazszxsnyg.jpg",
  alt: "Ceremonia de graduación de egresados de INCA EDUCA",
};

export const CARRERAS_GENERICAS: Record<string, ContenidoGenericoCarrera> = {
  "cosmetologia-y-estetica-personal": {
    heroImagen: {
      src: "https://res.cloudinary.com/dix9okebs/image/upload/v1790201817/inca-educa/galeria/pgautembt4zwutov8bj6.jpg",
      alt: "Estudiante de Cosmetología y Barbería de INCA EDUCA en una práctica de maquillaje artístico",
    },
    galeria: [
      {
        src: "https://res.cloudinary.com/dix9okebs/image/upload/v1790201915/inca-educa/galeria/vlknhzvhcmnhwdpqhtqp.jpg",
        alt: "Resultado de una práctica de coloración de cabello en INCA EDUCA",
      },
      {
        src: "https://res.cloudinary.com/dix9okebs/image/upload/v1790201845/inca-educa/galeria/jscp3vgukzqowbhnlpem.jpg",
        alt: "Estudiante de Cosmetología de INCA EDUCA con un look de Catrina",
      },
      {
        src: "https://res.cloudinary.com/dix9okebs/image/upload/v1790202087/inca-educa/galeria/puvtfwywjf41ux0hppy3.jpg",
        alt: "Entrega de título de Peluquería Básica a una egresada de INCA EDUCA",
      },
    ],
  },
  "panaderia-y-pasteleria-industrial": {
    heroImagen: {
      src: "https://res.cloudinary.com/dix9okebs/image/upload/v1790202048/inca-educa/galeria/ac1l9dzhdnctstyqkbe5.jpg",
      alt: "Galletas decoradas elaboradas por estudiantes de Panadería y Pastelería de INCA EDUCA",
    },
    galeria: [
      {
        src: "https://res.cloudinary.com/dix9okebs/image/upload/v1790201859/inca-educa/galeria/wkaxmnyjjamsjocrrtbb.jpg",
        alt: "Besos de moza preparados en un taller de pastelería de INCA EDUCA",
      },
      {
        src: "https://res.cloudinary.com/dix9okebs/image/upload/v1786745817/inca-educa/galeria/kziuyl1lluw7mywaykzt.jpg",
        alt: "Estudiantes de la carrera de Panadería de INCA EDUCA",
      },
    ],
  },
  "hosteleria-y-turismo": {
    heroImagen: {
      src: "https://res.cloudinary.com/dix9okebs/image/upload/v1786745761/inca-educa/galeria/obb1al4fshg0tawogyxo.jpg",
      alt: "Graduación de egresados de Hostelería y Turismo de INCA EDUCA",
    },
    galeria: [FOTO_BANDERA, FOTO_GRADUACION_GENERAL],
  },
  "operador-de-computadoras": {
    heroImagen: FOTO_ESTANDARTES,
    galeria: [FOTO_BANDERA, FOTO_DOCENTES],
  },
  "asistente-contable": {
    heroImagen: FOTO_DESFILE,
    galeria: [FOTO_GRADUACION_GENERAL, FOTO_DOCENTES],
  },
  "apoyo-administrativo": {
    heroImagen: FOTO_GRADUACION_GENERAL,
    galeria: [FOTO_BANDERA, FOTO_DOCENTES],
  },
  "logistica-y-almacen": {
    heroImagen: FOTO_DOCENTES,
    galeria: [FOTO_ESTANDARTES, FOTO_GRADUACION_GENERAL],
  },
};
