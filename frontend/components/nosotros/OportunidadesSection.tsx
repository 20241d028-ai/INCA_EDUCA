import FadeIn from "@/components/ui/FadeIn";
import SequenceFlow from "@/components/nosotros/SequenceFlow";

export default function OportunidadesSection() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="relative bg-cover bg-[center_30%] py-20 sm:py-24"
        style={{ backgroundImage: "url('/hero-inca-educa.jpg')" }}
      >
        <div
          className="absolute inset-0 bg-[var(--color-verde-oscuro)]/90"
          style={{
            background:
              "linear-gradient(to bottom, rgba(20,67,43,0.92) 0%, rgba(20,67,43,0.88) 100%)",
          }}
        />

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="font-titulo text-3xl md:text-4xl font-extrabold text-white">
              Educación que abre oportunidades
            </h2>
            <p className="mt-4 text-white/85 leading-relaxed max-w-xl mx-auto">
              Creemos que el acceso a una formación técnica puede abrir nuevas oportunidades para
              las personas, sus familias y la comunidad.
            </p>
          </FadeIn>

          <FadeIn delay={150} className="mt-10">
            <SequenceFlow pasos={["FORMACIÓN", "HABILIDADES", "OPORTUNIDADES", "FUTURO"]} />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
