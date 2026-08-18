"use client";

import Link from "next/link";
import { useAdminToken } from "@/lib/adminAuth";
import AdminShell from "@/components/admin/AdminShell";
import { IconChat, IconImage } from "@/components/ui/Icons";

const SECCIONES = [
  {
    href: "/admin/chatbot",
    titulo: "Chatbot",
    descripcion: "Conversaciones escaladas a un asesor y su historial con cada postulante.",
    icono: IconChat,
  },
  {
    href: "/admin/galeria",
    titulo: "Galería",
    descripcion: "Sube, organiza y elimina las fotos y videos de la galería pública.",
    icono: IconImage,
  },
];

export default function AdminDashboardPage() {
  const { listo, cerrarSesion } = useAdminToken();

  if (!listo) {
    return <div className="min-h-screen flex items-center justify-center text-[var(--color-tinta)]/60">Cargando…</div>;
  }

  return (
    <AdminShell titulo="Panel de administración" mostrarVolver={false} onSalir={cerrarSesion}>
      <p className="text-[var(--color-tinta)]/70">Elige qué sección quieres gestionar.</p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-5">
        {SECCIONES.map((s) => {
          const Icono = s.icono;
          return (
            <Link
              key={s.href}
              href={s.href}
              className="group bg-white rounded-2xl border border-[var(--color-linea)] p-6 shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-[var(--color-naranja)]"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--color-verde)]/10 text-[var(--color-verde)] flex items-center justify-center transition-colors duration-200 group-hover:bg-[var(--color-naranja)] group-hover:text-white">
                <Icono className="w-6 h-6" />
              </div>
              <h2 className="mt-4 font-titulo font-extrabold text-lg text-[var(--color-verde-oscuro)]">
                {s.titulo}
              </h2>
              <p className="mt-1.5 text-sm text-[var(--color-tinta)]/70 leading-relaxed">
                {s.descripcion}
              </p>
            </Link>
          );
        })}
      </div>
    </AdminShell>
  );
}
