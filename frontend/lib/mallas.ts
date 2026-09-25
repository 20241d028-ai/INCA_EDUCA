// TODO: Esto es un placeholder genérico, NO la malla curricular oficial.
// Reemplazar por el plan de estudios real de cada carrera (idealmente
// trayéndolo del backend) cuando esté disponible.

export interface CicloMalla {
  ciclo: number;
  titulo: string;
  descripcion: string;
}

const ETAPAS_GENERICAS: { titulo: string; descripcion: string }[] = [
  {
    titulo: "Fundamentos y bases técnicas",
    descripcion:
      "Se aprenden los conceptos, herramientas y técnicas básicas de la carrera, sentando las bases para las siguientes etapas.",
  },
  {
    titulo: "Técnicas intermedias y práctica dirigida",
    descripcion:
      "Se profundiza en técnicas más avanzadas, con práctica guiada y acompañamiento constante de los instructores.",
  },
  {
    titulo: "Especialización",
    descripcion:
      "Se afinan las habilidades específicas de la carrera, acercando al estudiante al nivel de desempeño profesional.",
  },
  {
    titulo: "Prácticas preprofesionales",
    descripcion:
      "Se aplica todo lo aprendido en un entorno real o simulado, como preparación directa para el campo laboral.",
  },
];

export function generarMallaPlaceholder(duracionMeses: number): CicloMalla[] {
  const MESES_POR_CICLO = 6;
  const totalCiclos = Math.max(1, Math.round(duracionMeses / MESES_POR_CICLO));

  return Array.from({ length: totalCiclos }, (_, i) => {
    const etapa = ETAPAS_GENERICAS[i] ?? { titulo: `Ciclo ${i + 1}`, descripcion: "" };
    return { ciclo: i + 1, titulo: etapa.titulo, descripcion: etapa.descripcion };
  });
}
