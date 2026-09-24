export function formatDuracion(duracionMeses: number): string {
  if (!duracionMeses || duracionMeses <= 0) return "Duración por confirmar";

  const anios = Math.floor(duracionMeses / 12);
  const meses = duracionMeses % 12;
  const partes: string[] = [];

  if (anios > 0) partes.push(`${anios} año${anios > 1 ? "s" : ""}`);
  if (meses > 0) partes.push(`${meses} mes${meses > 1 ? "es" : ""}`);

  return partes.join(" y ");
}

// Formatea una fecha de inicio de carrera (viene como ISO del backend) en
// español, ej. "15 de noviembre de 2026". Devuelve null si no hay fecha
// para que cada pantalla decida su propio mensaje (no se inventa una).
export function formatFechaInicio(fechaIso: string | null | undefined): string | null {
  if (!fechaIso) return null;
  const fecha = new Date(fechaIso);
  if (Number.isNaN(fecha.getTime())) return null;

  return fecha.toLocaleDateString("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
