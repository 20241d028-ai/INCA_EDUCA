import Hero from "@/components/home/Hero";
import FechaInicioClasesBanner from "@/components/home/FechaInicioClasesBanner";
import WhyUsSection from "@/components/home/WhyUsSection";
import CareersSection from "@/components/home/CareersSection";
import StepsSection from "@/components/home/StepsSection";
import { listarCarreras, obtenerConfiguracionSitio } from "@/lib/api";

export default async function Home() {
  const [carreras, configuracion] = await Promise.all([
    listarCarreras().catch(() => []),
    obtenerConfiguracionSitio().catch(() => ({ fechaInicioClases: null })),
  ]);

  return (
    <main>
      <Hero />
      <FechaInicioClasesBanner fechaInicioClases={configuracion.fechaInicioClases} />
      <WhyUsSection />
      <CareersSection carreras={carreras.slice(0, 4)} />
      <StepsSection />
    </main>
  );
}
