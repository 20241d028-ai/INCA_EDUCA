import type { CategoriaGaleria, GaleriaItem } from "@/lib/galeria";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Se lanza cuando el backend responde 401 (token no enviado, inválido o
// expirado) en un endpoint protegido de /admin. Las páginas de admin la
// detectan para cerrar la sesión y redirigir a /admin/login automáticamente,
// en vez de quedarse mostrando un error sin salida.
export class ApiAuthError extends Error {
  constructor(message = "Tu sesión expiró. Inicia sesión de nuevo.") {
    super(message);
    this.name = "ApiAuthError";
  }
}

async function lanzarErrorApi(res: Response, mensajePorDefecto: string): Promise<never> {
  if (res.status === 401) throw new ApiAuthError();
  const err = await res.json().catch(() => ({}) as { error?: string });
  throw new Error(err.error || `${mensajePorDefecto} (código ${res.status})`);
}

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
  origen?: "formulario" | "chatbot";
  consentimientoDatos?: boolean;
}) {
  const res = await fetch(`${API_URL}/api/postulantes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payload,
      origen: payload.origen ?? "chatbot",
      consentimientoDatos: payload.consentimientoDatos ?? true,
    }),
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
  return res.json() as Promise<{
    id: string;
    nombre: string;
    slug: string;
    duracionMeses: number;
    imagenUrl: string | null;
    descripcionCorta: string | null;
  }[]>;
}

export async function obtenerCarreraPorSlug(slug: string) {
  const res = await fetch(`${API_URL}/api/carreras/${slug}`);
  if (!res.ok) throw new Error("Carrera no encontrada");
  return res.json() as Promise<{
    id: string;
    nombre: string;
    slug: string;
    duracionMeses: number;
    imagenUrl: string | null;
    descripcionCorta: string | null;
  }>;
}

export async function listarGaleria(filtros?: {
  tipo?: "foto" | "video";
  categoria?: CategoriaGaleria;
  destacados?: boolean;
}) {
  const params = new URLSearchParams();
  if (filtros?.tipo) params.set("tipo", filtros.tipo);
  if (filtros?.categoria) params.set("categoria", filtros.categoria);
  if (filtros?.destacados) params.set("destacados", "true");
  const query = params.toString();

  const res = await fetch(`${API_URL}/api/galeria${query ? `?${query}` : ""}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("No se pudo cargar la galería");
  return res.json() as Promise<GaleriaItem[]>;
}

// Admin: incluye también los elementos inactivos (para poder reactivarlos).
export async function listarGaleriaAdmin(token: string) {
  const res = await fetch(`${API_URL}/api/galeria/admin/todos`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) await lanzarErrorApi(res, "No se pudo cargar la galería");
  return res.json() as Promise<GaleriaItem[]>;
}

export async function actualizarGaleria(
  id: string,
  datos: Partial<{
    titulo: string;
    evento: string;
    categoria: CategoriaGaleria | "";
    activo: boolean;
    destacado: boolean;
    orden: number;
  }>,
  token: string
) {
  const res = await fetch(`${API_URL}/api/galeria/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(datos),
  });
  if (!res.ok) await lanzarErrorApi(res, "No se pudo actualizar el elemento");
  return res.json() as Promise<GaleriaItem>;
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
    cache: "no-store",
  });
  if (!res.ok) await lanzarErrorApi(res, "No se pudieron cargar las conversaciones");
  return res.json();
}

export async function obtenerConversacionAdmin(id: string, token: string) {
  const res = await fetch(`${API_URL}/api/chat/conversaciones/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) await lanzarErrorApi(res, "No se pudo cargar la conversación");
  return res.json();
}

export async function subirGaleria(
  datos: {
    titulo: string;
    evento: string;
    tipo: "foto" | "video";
    categoria?: CategoriaGaleria;
    destacado?: boolean;
    orden?: number;
    archivo: File;
  },
  token: string
) {
  const formData = new FormData();
  formData.append("titulo", datos.titulo);
  formData.append("evento", datos.evento);
  formData.append("tipo", datos.tipo);
  if (datos.categoria) formData.append("categoria", datos.categoria);
  if (datos.destacado) formData.append("destacado", "true");
  if (datos.orden !== undefined) formData.append("orden", String(datos.orden));
  formData.append("archivo", datos.archivo);

  const res = await fetch(`${API_URL}/api/galeria`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) await lanzarErrorApi(res, "No se pudo subir el archivo");
  return res.json() as Promise<GaleriaItem>;
}

export async function eliminarGaleria(id: string, token: string) {
  const res = await fetch(`${API_URL}/api/galeria/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) await lanzarErrorApi(res, "No se pudo eliminar el elemento");
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