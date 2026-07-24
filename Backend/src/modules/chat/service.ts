import { prisma } from "../../prisma";
import { listarCarreras } from "../carreras/service";
import { RemitenteMensaje, TipoMensaje } from "@prisma/client";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string;
const GEMINI_MODEL = "gemini-3.5-flash-lite";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

async function construirContextoInstitucional() {
  const carreras = await listarCarreras();
  const listaCarreras = carreras
    .map((c) => `- ${c.nombre} (${c.duracionMeses} meses)`)
    .join("\n");

  return `Eres el asistente virtual de INCA EDUCA, un CETPRO (Centro de Educación Técnico-Productiva) en Cusco, Perú, fundado en 2002.

Información institucional:
- Teléfono: (084) 275994
- Correo: info@incaeduca.edu.pe
- Dirección: Prol. Av. la Cultura, 6º paradero San Sebastián, Cusco

Carreras disponibles:
${listaCarreras}

Reglas:
- Responde ÚNICAMENTE con información relacionada a INCA EDUCA y sus carreras.
- Si te preguntan algo fuera de este contexto, indica amablemente que solo puedes ayudar con temas de INCA EDUCA.
- Si el postulante muestra interés real en una carrera y pide hablar con un asesor, indícale que puedes conectarlo con uno.
- Sé breve, cálido y claro.`;
}

interface MensajeChat {
  remitente: "postulante" | "agente";
  contenido: string;
}

export async function generarRespuestaAgente(historial: MensajeChat[]) {
  const systemPrompt = await construirContextoInstitucional();

  const contents = historial.map((m) => ({
    role: m.remitente === "postulante" ? "user" : "model",
    parts: [{ text: m.contenido }],
  }));

  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents,
    }),
  });

  const data = await response.json();
  const texto = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!texto) {
    throw new Error("El agente no pudo generar una respuesta");
  }

  return texto as string;
}

export async function escalarConversacion(postulanteId: string, historial: MensajeChat[]) {
  return prisma.conversacion.create({
    data: {
      postulanteId,
      estado: "escalada",
      mensajes: {
        create: historial.map((m) => ({
          remitente: m.remitente as RemitenteMensaje,
          tipo: "texto" as TipoMensaje,
          contenido: m.contenido,
        })),
      },
    },
    include: { mensajes: true },
  });
}

export async function listarConversaciones() {
  return prisma.conversacion.findMany({
    include: { postulante: true, mensajes: true },
    orderBy: { fechaEscalamiento: "desc" },
  });
}

export async function obtenerConversacion(id: string) {
  return prisma.conversacion.findUnique({
    where: { id },
    include: { postulante: true, mensajes: { orderBy: { enviadoEn: "asc" } } },
  });
}