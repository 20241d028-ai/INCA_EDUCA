"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAdminToken } from "@/lib/adminAuth";
import AdminShell from "@/components/admin/AdminShell";
import { obtenerConversacionAdmin, ApiAuthError } from "@/lib/api";

interface Mensaje {
  id: string;
  remitente: string;
  contenido: string;
  enviadoEn: string;
}

interface ConversacionDetalle {
  postulante: {
    nombreApellido: string;
    celular: string;
    dni: string;
    carreraId: string;
  };
  mensajes: Mensaje[];
}

export default function ChatbotDetallePage() {
  const { token, listo, cerrarSesion } = useAdminToken();
  const [data, setData] = useState<ConversacionDetalle | null>(null);
  const [error, setError] = useState("");
  const params = useParams();

  useEffect(() => {
    if (!token) return;
    obtenerConversacionAdmin(params.id as string, token)
      .then(setData)
      .catch((e) => {
        if (e instanceof ApiAuthError) {
          cerrarSesion();
          return;
        }
        setError(e.message);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, token]);

  if (!listo) {
    return <div className="min-h-screen flex items-center justify-center text-[var(--color-tinta)]/60">Cargando…</div>;
  }

  return (
    <AdminShell titulo="Detalle de conversación" onSalir={cerrarSesion}>
      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
      {!data && !error && <p className="text-[var(--color-tinta)]/60">Cargando…</p>}

      {data && (
        <>
          <div className="bg-white rounded-2xl border border-[var(--color-linea)] p-6 shadow-sm">
            <h2 className="font-titulo text-xl font-semibold text-[var(--color-verde-oscuro)]">
              {data.postulante.nombreApellido}
            </h2>
            <p className="mt-1 text-sm text-[var(--color-tinta)]/70">
              DNI: {data.postulante.dni} — Celular: <strong>{data.postulante.celular}</strong>
            </p>

            <a
              href={`https://wa.me/51${data.postulante.celular}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 rounded-full bg-[#25D366] text-white text-sm font-semibold px-5 py-2.5 hover:brightness-95 transition"
            >
              Contactar por WhatsApp
            </a>
          </div>

          <h3 className="mt-8 font-titulo font-bold text-lg text-[var(--color-tinta)]">
            Historial de la conversación
          </h3>

          <div className="mt-3 flex flex-col gap-2">
            {data.mensajes.map((m) => (
              <div
                key={m.id}
                className={`rounded-xl px-4 py-3 text-sm ${
                  m.remitente === "postulante"
                    ? "bg-[var(--color-verde)]/10 text-[var(--color-tinta)]"
                    : "bg-white border border-[var(--color-linea)] text-[var(--color-tinta)]"
                }`}
              >
                <span className="font-bold capitalize">{m.remitente}:</span> {m.contenido}
              </div>
            ))}
          </div>
        </>
      )}
    </AdminShell>
  );
}
