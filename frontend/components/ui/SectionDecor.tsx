// Formas decorativas reutilizables (blobs orgánicos + rejilla de puntos +
// pequeños acentos), en el mismo estilo que ya usa el Hero de Inicio, para
// que las secciones de fondo liso no se sientan vacías. Puramente estético
// (aria-hidden, pointer-events-none): no debe interferir con el contenido
// ni con el layout — se coloca como primer hijo de un contenedor
// `relative overflow-hidden`.
export default function SectionDecor({
  variant = "verde",
}: {
  variant?: "verde" | "naranja" | "claro";
}) {
  const esClaro = variant === "claro";
  const colorPrincipal = variant === "naranja" ? "var(--color-naranja)" : "var(--color-verde)";
  const colorPuntos = esClaro ? "white" : "var(--color-verde-oscuro)";

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute -top-14 -right-20 w-64 h-64 sm:w-80 sm:h-80 rounded-[58%_42%_38%_62%/55%_35%_65%_45%]"
        style={{ background: colorPrincipal, opacity: esClaro ? 0.08 : 0.06 }}
      />
      <div
        className="absolute -bottom-20 -left-16 w-56 h-56 sm:w-72 sm:h-72 rounded-[42%_58%_65%_35%/45%_55%_40%_60%]"
        style={{ background: colorPrincipal, opacity: esClaro ? 0.07 : 0.05 }}
      />

      <div
        className="absolute top-[12%] left-[6%] grid grid-cols-3 gap-1.5"
        style={{ opacity: esClaro ? 0.35 : 0.25 }}
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} className="w-1 h-1 rounded-full" style={{ background: colorPuntos }} />
        ))}
      </div>

      <span
        className="absolute top-[20%] right-[10%] w-4 h-4 rounded-full border-2"
        style={{ borderColor: colorPrincipal, opacity: 0.35 }}
      />
      <svg
        viewBox="0 0 24 24"
        className="absolute bottom-[18%] right-[16%] w-4 h-4"
        style={{ color: colorPrincipal, opacity: 0.4 }}
      >
        <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}
