import Hero from "@/components/home/Hero";
import WhyUsSection from "@/components/home/WhyUsSection";
import CareersSection from "@/components/home/CareersSection";
import StepsSection from "@/components/home/StepsSection";
import { listarCarreras } from "@/lib/api";

export default async function Home() {
  const carreras = await listarCarreras().catch(() => []);

  return (
    <main>
      <Hero />
      <WhyUsSection />
      <CareersSection carreras={carreras.slice(0, 4)} />
      <StepsSection />
    </main>
  );
}
