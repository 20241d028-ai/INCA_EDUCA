// TODO: Esto es un placeholder genérico, NO la malla curricular oficial.
// Reemplazar por el plan de estudios real de cada carrera (idealmente
// trayéndolo del backend) cuando esté disponible.

export interface CicloMalla {
  ciclo: number;
  titulo: string;
}

const ETAPAS_GENERICAS = [
  "Fundamentos y bases técnicas",
  "Técnicas intermedias y práctica dirigida",
  "Especialización",
  "Prácticas preprofesionales",
];

export function generarMallaPlaceholder(duracionMeses: number): CicloMalla[] {
  const MESES_POR_CICLO = 6;
  const totalCiclos = Math.max(1, Math.round(duracionMeses / MESES_POR_CICLO));

  return Array.from({ length: totalCiclos }, (_, i) => ({
    ciclo: i + 1,
    titulo: ETAPAS_GENERICAS[i] ?? `Ciclo ${i + 1}`,
  }));
}
