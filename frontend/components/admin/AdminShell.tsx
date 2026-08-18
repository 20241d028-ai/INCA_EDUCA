"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconChat, IconImage } from "@/components/ui/Icons";

const SECCIONES = [
  { href: "/admin/chatbot", label: "Chatbot", icono: IconChat },
  { href: "/admin/galeria", label: "Galería", icono: IconImage },
];

export default function AdminShell({
  titulo,
  mostrarVolver = true,
  onSalir,
  children,
}: {
  titulo: string;
  mostrarVolver?: boolean;
  onSalir: () => void;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--color-fondo)]">
      <header className="bg-white border-b border-[var(--color-linea)]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link href="/admin">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-tinta)]/40">
              Panel administrativo · INCA EDUCA
            </p>
            <h1 className="font-titulo text-xl font-extrabold text-[var(--color-verde-oscuro)]">
              {titulo}
            </h1>
          </Link>

          <div className="flex items-center gap-3">
            {mostrarVolver && (
              <Link
                href="/admin"
                className="text-sm font-semibold text-[var(--color-tinta)]/70 hover:text-[var(--color-verde-oscuro)] transition"
              >
                ← Panel
              </Link>
            )}
            <button
              type="button"
              onClick={onSalir}
              className="text-sm font-bold text-[var(--color-naranja)] hover:brightness-90 transition"
            >
              Salir
            </button>
          </div>
        </div>

        {/* Navegación persistente entre secciones del admin */}
        <nav className="max-w-5xl mx-auto px-6 pb-3 flex flex-wrap gap-2">
          {SECCIONES.map((s) => {
            const activa = pathname?.startsWith(s.href);
            const Icono = s.icono;
            return (
              <Link
                key={s.href}
                href={s.href}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold transition ${
                  activa
                    ? "bg-[var(--color-verde)] text-white"
                    : "bg-[var(--color-fondo)] text-[var(--color-tinta)]/70 hover:bg-[var(--color-verde)]/10 hover:text-[var(--color-verde-oscuro)]"
                }`}
              >
                <Icono className="w-4 h-4" />
                {s.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
