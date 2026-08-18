import Link from "next/link";
import { notFound } from "next/navigation";
import { obtenerCarreraPorSlug } from "@/lib/api";
import { generarMallaPlaceholder } from "@/lib/mallas";
import { formatDuracion } from "@/lib/format";

export default async function CarreraDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let carrera;
  try {
    carrera = await obtenerCarreraPorSlug(slug);
  } catch {
    notFound();
  }

  return (
    <main className="pt-24 max-w-4xl mx-auto px-6 pb-16">
      <div
        className="w-full h-64 rounded-3xl bg-cover bg-center bg-[var(--color-linea)]"
        style={{ backgroundImage: `url('${carrera.imagenUrl || `/carreras/${carrera.slug}.jpg`}')` }}
      />
      <h1 className="font-titulo text-4xl font-extrabold text-[var(--color-tinta)] mt-8">
        {carrera.nombre}
      </h1>
      <p className="mt-2 text-[var(--color-tinta)]/70">
        Duración: {formatDuracion(carrera.duracionMeses)}
      </p>
      <p className="mt-6 text-[var(--color-tinta)] leading-relaxed">
        {carrera.descripcionCorta || "Próximamente más información sobre esta carrera."}
      </p>

      <section className="mt-14">
        <h2 className="font-titulo text-2xl font-bold text-[var(--color-tinta)]">
          Malla curricular
        </h2>
        <p className="mt-1 text-sm text-[var(--color-tinta)]/60">
          Referencial. El plan de estudios detallado se confirma con un asesor.
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {generarMallaPlaceholder(carrera.duracionMeses).map((c) => (
            <div
              key={c.ciclo}
              className="rounded-2xl border border-[var(--color-linea)] p-5 flex items-center gap-4"
            >
              <div className="w-10 h-10 flex-shrink-0 rounded-full bg-[var(--color-verde)] text-white font-titulo font-bold flex items-center justify-center">
                {c.ciclo}
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--color-tinta)]/50 uppercase">
                  Ciclo {c.ciclo}
                </p>
                <p className="font-semibold text-[var(--color-tinta)]">{c.titulo}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Link
        href="/admision"
        className="inline-flex items-center gap-2 mt-12 rounded-full bg-[var(--color-naranja)] text-white font-bold px-7 py-3.5 hover:brightness-95 transition"
      >
        Postular a esta carrera
        <span aria-hidden="true">→</span>
      </Link>
    </main>
  );
}