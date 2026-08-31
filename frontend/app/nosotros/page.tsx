import NosotrosHero from "@/components/nosotros/NosotrosHero";
import QuienesSomos from "@/components/nosotros/QuienesSomos";
import HistoriaTimeline from "@/components/nosotros/HistoriaTimeline";
import ImpactoSection from "@/components/nosotros/ImpactoSection";
import FormacionSection from "@/components/nosotros/FormacionSection";
import OportunidadesSection from "@/components/nosotros/OportunidadesSection";
import MisionVisionSection from "@/components/nosotros/MisionVisionSection";
import DesafioSection from "@/components/nosotros/DesafioSection";
import ContactoSection from "@/components/nosotros/ContactoSection";

export default function NosotrosPage() {
  return (
    <main>
      <NosotrosHero />
      <QuienesSomos />
      <HistoriaTimeline />
      <ImpactoSection />
      <FormacionSection />
      <OportunidadesSection />
      <MisionVisionSection />
      <DesafioSection />
      <ContactoSection />
    </main>
  );
}
