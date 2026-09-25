import ContadorAnimado from "@/components/ui/ContadorAnimado";

// Banda de datos reales (duración, próximo inicio y número de etapas de
// formación) para las carreras sin contenido enriquecido propio. Mismo
// estilo visual que CarreraInfoRapida (usada en Gastronomía Internacional),
// pero solo con cifras que existen de verdad: duración y fecha vienen de
// la base de datos (administradas desde /admin/carreras), y el número de
// etapas se calcula a partir de la duración real (ver lib/mallas.ts).
export default function CarreraInfoRapidaGenerica({
  duracionTexto,
  fechaInicio,
  numeroEtapas,
}: {
  duracionTexto: string;
  fechaInicio: string | null;
  numeroEtapas: number;
}) {
  return (
    <section className="bg-[var(--color-fondo)] pb-16 sm:pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="rounded-3xl bg-[var(--color-verde-oscuro)] shadow-xl px-6 py-10 sm:px-10 sm:py-12">
          <div className="grid grid-cols-2 gap-y-8 gap-x-6 text-center">
            <div>
              <p className="font-titulo text-4xl sm:text-5xl font-extrabold text-[var(--color-naranja)]">
                <ContadorAnimado valor={duracionTexto} />
              </p>
              <p className="mt-2 text-sm sm:text-base font-semibold text-white/80 uppercase tracking-wide">
                Duración
              </p>
            </div>
            <div>
              <p className="font-titulo text-4xl sm:text-5xl font-extrabold text-[var(--color-naranja)]">
                <ContadorAnimado valor={String(numeroEtapas)} />
              </p>
              <p className="mt-2 text-sm sm:text-base font-semibold text-white/80 uppercase tracking-wide">
                Etapas de formación
              </p>
            </div>
          </div>

          {fechaInicio && (
            <p className="mt-8 pt-6 border-t border-white/15 text-center text-sm sm:text-base font-semibold text-white/90">
              Próximo inicio: <span className="text-[var(--color-naranja)]">{fechaInicio}</span>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
