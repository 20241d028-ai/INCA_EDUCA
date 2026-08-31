// Carreras: cifra real (las 8 carreras activas en la base de datos).
// Estudiantes, Docentes y % de formación práctica: cifras provistas por
// Cristhian el 2026-08-13. Actualizar aquí si cambian.
const ESTADISTICAS = [
  { valor: "8", etiqueta: "Carreras" },
  { valor: "+1500", etiqueta: "Estudiantes" },
  { valor: "+20", etiqueta: "Docentes" },
  { valor: "85%", etiqueta: "Formación práctica" },
];

export default function StatsSection() {
  return (
    <section className="bg-[var(--color-fondo)] py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="rounded-3xl bg-[var(--color-verde-oscuro)] shadow-xl px-6 py-12 sm:px-10 sm:py-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6 text-center">
            {ESTADISTICAS.map((e) => (
              <div key={e.etiqueta}>
                <p className="font-titulo text-4xl sm:text-5xl font-extrabold text-[var(--color-naranja)]">
                  {e.valor}
                </p>
                <p className="mt-2 text-sm sm:text-base font-semibold text-white/80 uppercase tracking-wide">
                  {e.etiqueta}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
