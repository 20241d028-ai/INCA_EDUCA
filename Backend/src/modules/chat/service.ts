import { prisma } from "../../prisma";
import { listarCarreras } from "../carreras/service";
import { RemitenteMensaje, TipoMensaje } from "@prisma/client";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string;
const GEMINI_MODEL = "gemini-3.5-flash-lite";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

type CanalChat = "web" | "whatsapp";

async function construirContextoInstitucional(canal: CanalChat) {
  const carreras = await listarCarreras();
  const listaCarreras = carreras
    .map((c) => `- ${c.nombre} (${c.duracionMeses} meses)`)
    .join("\n");

  const instruccionAsesor =
    canal === "whatsapp"
      ? "Si el postulante muestra interés real en una carrera y pide hablar con un asesor, pídele su nombre completo, DNI y la carrera que le interesa directamente aquí por chat, ya que estamos en WhatsApp. Una vez que tengas esos datos, indícale que un asesor se pondrá en contacto pronto."
      : "Si el postulante muestra interés real en una carrera y pide hablar con un asesor, NO le pidas su nombre, DNI o celular por chat. En vez de eso, dile brevemente que complete el formulario que aparece justo debajo del chat para conectarlo con un asesor.";

  const instruccionTono =
    canal === "whatsapp"
      ? "\n- Usa emojis con naturalidad para dar calidez a la conversación, como lo haría cualquier persona real chateando por WhatsApp (por ejemplo: saludos con 👋😊, temas de estudio con 📚🎓, confirmaciones con ✅👍, entusiasmo con 🙌). No tengas miedo de usarlos, pero evita ponerlos en cada palabra."
      : "";

  const instruccionListasCarreras =
    canal === "whatsapp"
      ? "\n- Cuando menciones la lista completa de carreras disponibles, escribe cada una en su propia línea, precedida por el emoji 🎓 (por ejemplo:\n🎓 Gastronomía Internacional\n🎓 Hostelería y Turismo\n...). No las juntes en un solo párrafo separadas por comas o punto y coma."
      : "";

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
- ${instruccionAsesor}
- No uses formato Markdown (nada de asteriscos, negritas ni listas con guiones). Escribe en texto plano, en párrafos cortos.${instruccionTono}${instruccionListasCarreras}
- Sé breve, cálido y claro.`;
}

interface MensajeChat {
  remitente: "postulante" | "agente";
  contenido: string;
}

export async function generarRespuestaAgente(historial: MensajeChat[], canal: CanalChat = "web") {
  const systemPrompt = await construirContextoInstitucional(canal);

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