"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { obtenerConversacionAdmin } from "@/lib/api";

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

export default function ConversacionDetallePage() {
  const [data, setData] = useState<ConversacionDetalle | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    obtenerConversacionAdmin(params.id as string, token)
      .then(setData)
      .catch((e) => setError(e.message));
  }, [params.id, router]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!data) return <p>Cargando...</p>;

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "40px auto",
        fontFamily: "sans-serif",
      }}
    >
      <h1>{data.postulante.nombreApellido}</h1>

      <p>
        DNI: {data.postulante.dni} — Celular:{" "}
        <strong>{data.postulante.celular}</strong>
      </p>

      <a
        href={`https://wa.me/51${data.postulante.celular}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          margin: "10px 0",
          padding: "8px 16px",
          background: "#25D366",
          color: "white",
        }}
      >
        Contactar por WhatsApp
      </a>

      <h2>Historial de la conversación</h2>

      {data.mensajes.map((m) => (
        <div
          key={m.id}
          style={{
            marginBottom: 8,
            padding: 8,
            background: m.remitente === "postulante" ? "#eef" : "#eee",
          }}
        >
          <strong>{m.remitente}:</strong> {m.contenido}
        </div>
      ))}
    </div>
  );
}