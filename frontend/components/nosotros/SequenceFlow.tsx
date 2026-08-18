// Secuencia de etapas conectadas por flechas — reutilizada en "Educación que
// abre oportunidades" y en "Nuestro próximo desafío" para no duplicar código.
export default function SequenceFlow({ pasos }: { pasos: string[] }) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4">
      {pasos.map((paso, i) => (
        <div key={paso} className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
          <span className="rounded-full border-2 border-[var(--color-naranja)] bg-white/10 backdrop-blur-sm px-5 py-2.5 text-sm sm:text-base font-titulo font-extrabold text-white tracking-wide text-center">
            {paso}
          </span>
          {i < pasos.length - 1 && (
            <span className="text-[var(--color-naranja)] font-bold text-xl leading-none" aria-hidden="true">
              <span className="md:hidden">↓</span>
              <span className="hidden md:inline">→</span>
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
