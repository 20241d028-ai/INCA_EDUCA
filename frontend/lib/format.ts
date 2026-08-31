export function formatDuracion(duracionMeses: number): string {
  if (!duracionMeses || duracionMeses <= 0) return "Duración por confirmar";

  const anios = Math.floor(duracionMeses / 12);
  const meses = duracionMeses % 12;
  const partes: string[] = [];

  if (anios > 0) partes.push(`${anios} año${anios > 1 ? "s" : ""}`);
  if (meses > 0) partes.push(`${meses} mes${meses > 1 ? "es" : ""}`);

  return partes.join(" y ");
}
