import FadeIn from "@/components/ui/FadeIn";
import SectionDecor from "@/components/ui/SectionDecor";
export default function GaleriaHeader() {
  return (
    <section className="relative overflow-hidden bg-white pt-28 pb-8 sm:pt-32">
      <SectionDecor variant="naranja" />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <FadeIn>
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-naranja)]">Galería</p>
          <h1 className="mt-2 font-titulo text-4xl md:text-5xl font-extrabold text-[var(--color-verde-oscuro)]">
            Momentos que nos representan
          </h1>
        </FadeIn>
        <FadeIn delay={120}>
          <p className="mt-4 text-[var(--color-tinta)]/70 max-w-2xl leading-relaxed">
            Conoce las experiencias, logros y momentos que forman parte de la comunidad educativa de
            INCA EDUCA.
          </p>
        </FadeIn>
        <div className="mt-5 h-1 w-16 rounded-full bg-[var(--color-naranja)]" />
      </div>
    </section>
  );
}
