import GaleriaHeader from "@/components/galeria/GaleriaHeader";
import GaleriaSecciones from "@/components/galeria/GaleriaSecciones";

export default function GaleriaPage() {
  return (
    <main className="bg-[var(--color-fondo)]">
      <GaleriaHeader />
      <GaleriaSecciones />
    </main>
  );
}
