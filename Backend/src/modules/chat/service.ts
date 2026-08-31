import { prisma } from "../../prisma";
import { listarCarreras } from "../carreras/service";
import { RemitenteMensaje, TipoMensaje } from "@prisma/client";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string;
const GEMINI_MODEL = "gemini-3.5-flash-lite";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

type CanalChat = "web" | "whatsapp";

// Rutas estáticas del frontend que el chatbot puede ofrecer como destino
// de navegación (fuera de las carreras individuales, que salen dinámicamente
// de la DB con su propio slug).
const RUTAS_ESTATICAS: Record<string, string> = {
  carreras: "/carreras",
  galeria: "/galeria",
  contacto: "/contacto",
  admision: "/admision",
  nosotros: "/nosotros",
};

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
    "\n- Usa emojis con naturalidad para dar calidez a la conversación (por ejemplo: saludos con 👋😊, temas de estudio con 📚🎓, confirmaciones con ✅👍, entusiasmo con 🙌). No tengas miedo de usarlos, pero evita ponerlos en cada palabra.";

  const instruccionListasCarreras =
    "\n- Cuando menciones la lista completa de carreras disponibles, escribe cada una en su propia línea, precedida por el emoji 🎓 (por ejemplo:\n🎓 Gastronomía Internacional\n🎓 Hostelería y Turismo\n...). No las juntes en un solo párrafo separadas por comas o punto y coma.";

  // La navegación conversacional solo tiene sentido en la web (hay una
  // página real a la que llevar al usuario). En WhatsApp no se ofrece.
  const instruccionNavegacion =
    canal === "web"
      ? `

Puedes ayudar al usuario a moverse por la página web cuando detectes intención real de navegar, no solo de preguntar. Estas son las rutas disponibles:

Carreras (arma "destino" exactamente como "/carreras/{slug}", usando el slug exacto de la lista):
${carreras.map((c) => `- ${c.nombre} → "/carreras/${c.slug}"`).join("\n")}

Otras secciones:
- Sección de carreras (listado completo de todas las carreras) → destino "/carreras"
- Galería de fotos y videos → destino "/galeria"
- Formulario de contacto → destino "/contacto"
- Formulario de admisión/postulación → destino "/admision"
- Sobre nosotros / historia institucional → destino "/nosotros"

Diferencia clave entre preguntar e ir a un lugar:
- "¿Qué carreras tienen?", "cuéntame de gastronomía", "cuánto dura la carrera de cosmetología" → esto es una PREGUNTA. Respondes normalmente en el campo "respuesta" y el campo "accion" queda en null.
- "llévame a gastronomía", "quiero ir a la carrera de gastronomía", "llévame a la sección de carreras", "muéstrame la galería", "ábreme el formulario de contacto" → esto es una INTENCIÓN DE NAVEGAR. Aquí, además de responder brevemente en "respuesta" (algo como "Claro, te llevo ahí"), llenas el campo "accion" con el "destino" exacto de la lista de arriba.

Solo llena "accion" cuando la intención de moverse a otra sección sea clara y explícita. Ante la duda, trata el mensaje como pregunta y deja "accion" en null.`
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
- Sé breve, cálido y claro.${instruccionNavegacion}

Responde siempre con un JSON que tenga exactamente los campos "respuesta" (string) y "accion" (null, o un objeto con "tipo" y "destino" según corresponda).`;
}

interface MensajeChat {
  remitente: "postulante" | "agente";
  contenido: string;
}

export interface AccionNavegacion {
  tipo: "navegar";
  destino: string; // ej: "/carreras/gastronomia-internacional" o "/galeria"
}

interface RespuestaAgente {
  respuesta: string;
  accion: AccionNavegacion | null;
}

// Construye el schema que fuerza a Gemini a responder en JSON con la forma
// que necesitamos, evitando tener que parsear texto libre para saber si
// el usuario quiere navegar o solo está preguntando.
function construirResponseSchema() {
  return {
    type: "object",
    properties: {
      respuesta: { type: "string" },
      accion: {
        type: "object",
        nullable: true,
        properties: {
          tipo: { type: "string", enum: ["navegar"] },
          destino: { type: "string" },
        },
        required: ["tipo", "destino"],
      },
    },
    required: ["respuesta", "accion"],
  };
}

export async function generarRespuestaAgente(
  historial: MensajeChat[],
  canal: CanalChat = "web"
): Promise<RespuestaAgente> {
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
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: construirResponseSchema(),
      },
    }),
  });

  const data = await response.json();
  const textoJson = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textoJson) {
    throw new Error("El agente no pudo generar una respuesta");
  }

  let parsed: RespuestaAgente;
  try {
    parsed = JSON.parse(textoJson);
  } catch {
    // Red de seguridad: si por algún motivo Gemini no devuelve JSON válido,
    // no rompemos el chat — mostramos el texto crudo y sin navegación.
    return { respuesta: textoJson, accion: null };
  }

  // El canal WhatsApp nunca debe disparar navegación.
  if (canal === "whatsapp") {
    return { respuesta: parsed.respuesta, accion: null };
  }

  return parsed;
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