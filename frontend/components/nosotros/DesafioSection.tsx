import FadeIn from "@/components/ui/FadeIn";
import SequenceFlow from "@/components/nosotros/SequenceFlow";

export default function DesafioSection() {
  return (
    <section className="bg-[var(--color-verde-oscuro)] py-20">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <FadeIn>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-[var(--color-naranja)]">
            En trámite
          </span>

          <h2 className="mt-5 font-titulo text-3xl md:text-4xl font-bold text-white">
            Nuestro próximo desafío
          </h2>
          <p className="mt-4 text-white/85 leading-relaxed max-w-xl mx-auto">
            INCA EDUCA continúa trabajando para ampliar sus oportunidades de formación y avanzar
            hacia su autorización como Instituto de Educación Superior Tecnológico.
          </p>
        </FadeIn>

        <FadeIn delay={150} className="mt-10">
          <SequenceFlow pasos={["CETPRO", "EVOLUCIÓN", "EDUCACIÓN SUPERIOR TECNOLÓGICA"]} />
        </FadeIn>
      </div>
    </section>
  );
}
