import CarrerasGrid from "@/components/carreras/CarrerasGrid";
import CarrerasBanner from "@/components/carreras/CarrerasBanner";
import WhyStudySection from "@/components/carreras/WhyStudySection";
import StatsSection from "@/components/carreras/StatsSection";
import ApplyStepsSection from "@/components/carreras/ApplyStepsSection";
import FaqSection from "@/components/carreras/FaqSection";
import FinalCtaSection from "@/components/carreras/FinalCtaSection";
import Swoosh from "@/components/ui/Swoosh";
import { listarCarreras } from "@/lib/api";

// Renderiza en cada request en vez de intentar generar HTML estático en el
// build. Así, si el backend está temporalmente caído durante un deploy de
// Vercel, el build no falla — solo esta página se ve afectada, y en cuanto
// el backend vuelve, la página funciona sola sin necesitar un nuevo deploy.
export const dynamic = "force-dynamic";

export default async function CarrerasPage() {
  let carreras: Awaited<ReturnType<typeof listarCarreras>> = [];
  let errorCarga = false;

  try {
    carreras = await listarCarreras();
  } catch {
    errorCarga = true;
  }

  return (
    <main id="carreras" className="pt-24">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-[58%] px-6 sm:px-10 lg:px-12 py-10">
          <h1 className="font-titulo text-3xl md:text-4xl font-bold text-[var(--color-verde-oscuro)]">
            Conoce nuestras{" "}
            <span className="relative inline-block text-[var(--color-naranja)]">
              carreras
              <Swoosh className="absolute left-0 -bottom-2 w-full h-3" />
            </span>
          </h1>

          <p className="mt-5 pl-4 border-l-4 border-[var(--color-naranja)] text-[var(--color-tinta)]/80 max-w-xl">
            Elige una de nuestras carreras técnicas con formación práctica orientada al mercado laboral.
          </p>

          <div className="mt-10">
            {errorCarga ? (
              <p className="text-[var(--color-tinta)]/70">
                No pudimos cargar las carreras en este momento. Por favor, actualiza la página o vuelve a intentarlo en unos minutos.
              </p>
            ) : (
              <CarrerasGrid carreras={carreras} />
            )}
          </div>
        </div>

        <div className="lg:w-[42%] relative min-h-[420px]">
          <CarrerasBanner />
        </div>
      </div>

      <WhyStudySection />
      <StatsSection />
      <ApplyStepsSection />
      <FaqSection />
      <FinalCtaSection />
    </main>
  );
}