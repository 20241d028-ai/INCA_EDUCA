const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface MensajeChat {
  remitente: "postulante" | "agente";
  contenido: string;
}

export async function enviarMensajeAgente(historial: MensajeChat[]) {
  const res = await fetch(`${API_URL}/api/chat/mensaje`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ historial }),
  });
  if (!res.ok) throw new Error("No se pudo obtener respuesta del agente");
  const data = await res.json();
  return data.respuesta as string;
}

export async function crearPostulante(payload: {
  nombreApellido: string;
  dni: string;
  celular: string;
  carreraId: string;
}) {
  const res = await fetch(`${API_URL}/api/postulantes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, origen: "chatbot", consentimientoDatos: true }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "No se pudo registrar el postulante");
  }
  return res.json();
}

export async function escalarConversacion(postulanteId: string, historial: MensajeChat[]) {
  const res = await fetch(`${API_URL}/api/chat/escalar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postulanteId, historial }),
  });
  if (!res.ok) throw new Error("No se pudo escalar la conversación");
  return res.json();
}

export async function listarCarreras() {
  const res = await fetch(`${API_URL}/api/carreras`);
  if (!res.ok) throw new Error("No se pudieron cargar las carreras");
  return res.json() as Promise<{ id: string; nombre: string; slug: string }[]>;
}
export async function loginAdmin(email: string, password: string) {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Credenciales inválidas");
    }
    return res.json() as Promise<{ token: string; admin: { id: string; nombre: string; email: string } }>;
  }
  
  export async function listarConversacionesAdmin(token: string) {
    const res = await fetch(`${API_URL}/api/chat/conversaciones`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("No se pudieron cargar las conversaciones");
    return res.json();
  }
  
  export async function obtenerConversacionAdmin(id: string, token: string) {
    const res = await fetch(`${API_URL}/api/chat/conversaciones/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("No se pudo cargar la conversación");
    return res.json();
  }

  export async function enviarMensajeAudio(audioBlob: Blob, historial: MensajeChat[]) {
    const formData = new FormData();
    formData.append("audio", audioBlob, "audio.webm");
    formData.append("historial", JSON.stringify(historial));
  
    const res = await fetch(`${API_URL}/api/chat/mensaje-audio`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("No se pudo procesar el audio");
    return res.json() as Promise<{
      textoTranscrito: string;
      respuesta: string;
      respuestaAudioBase64: string;
    }>;
  }