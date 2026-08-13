import Hero from "@/components/home/Hero";
import CareersSection from "@/components/home/CareersSection";
import StepsSection from "@/components/home/StepsSection";

async function obtenerCarrerasDestacadas() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/carreras`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const carreras = await res.json();
  return carreras.slice(0, 4);
}

export default async function Home() {
  const carreras = await obtenerCarrerasDestacadas();

  return (
    <main>
      <Hero />
      <CareersSection carreras={carreras} />
      <StepsSection />
    </main>
  );
}