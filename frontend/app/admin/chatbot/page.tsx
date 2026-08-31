"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAdminToken } from "@/lib/adminAuth";
import AdminShell from "@/components/admin/AdminShell";
import { listarConversacionesAdmin, ApiAuthError } from "@/lib/api";

interface Conversacion {
  id: string;
  estado: string;
  fechaEscalamiento: string;
  postulante: { nombreApellido: string; celular: string; dni: string };
}

export default function ChatbotPage() {
  const { token, listo, cerrarSesion } = useAdminToken();
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    listarConversacionesAdmin(token)
      .then(setConversaciones)
      .catch((e) => {
        if (e instanceof ApiAuthError) {
          cerrarSesion();
          return;
        }
        setError(e.message);
      })
      .finally(() => setCargando(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (!listo) {
    return <div className="min-h-screen flex items-center justify-center text-[var(--color-tinta)]/60">Cargando…</div>;
  }

  return (
    <AdminShell titulo="Chatbot · Conversaciones escaladas" onSalir={cerrarSesion}>
      {cargando && <p className="text-[var(--color-tinta)]/60">Cargando conversaciones…</p>}

      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

      {!cargando && conversaciones.length === 0 && !error && (
        <div className="bg-white rounded-2xl border border-[var(--color-linea)] py-14 text-center text-[var(--color-tinta)]/60">
          No hay conversaciones escaladas todavía.
        </div>
      )}

      <div className="flex flex-col gap-3">
        {conversaciones.map((c) => (
          <Link
            key={c.id}
            href={`/admin/chatbot/${c.id}`}
            className="bg-white rounded-2xl border border-[var(--color-linea)] p-5 shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md hover:border-[var(--color-naranja)]"
          >
            <p className="font-titulo font-bold text-[var(--color-tinta)]">
              {c.postulante.nombreApellido}
            </p>
            <p className="text-sm text-[var(--color-tinta)]/60 mt-0.5">{c.postulante.celular}</p>
            <p className="text-xs text-[var(--color-tinta)]/40 mt-2">
              {new Date(c.fechaEscalamiento).toLocaleString("es-PE")}
            </p>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
