"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { listarConversacionesAdmin } from "@/lib/api";

interface Conversacion {
  id: string;
  estado: string;
  fechaEscalamiento: string;
  postulante: { nombreApellido: string; celular: string; dni: string };
}

export default function ConversacionesPage() {
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    listarConversacionesAdmin(token)
      .then(setConversaciones)
      .catch((e) => setError(e.message));
  }, [router]);

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Conversaciones escaladas</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {conversaciones.length === 0 && !error && <p>No hay conversaciones todavía.</p>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {conversaciones.map((c) => (
          <li key={c.id} style={{ border: "1px solid #ccc", padding: 12, marginBottom: 8 }}>
            <Link href={`/admin/conversaciones/${c.id}`}>
              <strong>{c.postulante.nombreApellido}</strong> — {c.postulante.celular}
              <br />
              <small>{new Date(c.fechaEscalamiento).toLocaleString("es-PE")}</small>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}