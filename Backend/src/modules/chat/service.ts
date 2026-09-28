import { prisma } from "../../prisma";
import { listarCarreras } from "../carreras/service";
import { RemitenteMensaje, TipoMensaje } from "@prisma/client";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string;
const GEMINI_MODEL = "gemini-3.5-flash-lite";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

type CanalChat = "web" | "whatsapp";

export interface AccionChatAgente {
  tipo: "navegar";
  ruta: string;
}

export interface RespuestaAgente {
  respuesta: string;
  accion: AccionChatAgente | null;
}

// Rutas fijas del sitio a las que el agente puede llevar al usuario (además
// de "/carreras/<slug>" por cada carrera, que se arma dinámicamente). Sirven
// también como lista blanca: una "ruta" que el modelo devuelva y no esté acá
// (ni sea una carrera real) se descarta en vez de navegar a un lugar inventado.
const RUTAS_FIJAS: { ruta: string; etiqueta: string }[] = [
  { ruta: "/carreras", etiqueta: "Listado completo de todas las carreras" },
  { ruta: "/galeria", etiqueta: "Galería de fotos" },
  { ruta: "/admision", etiqueta: "Proceso de admisión / fechas de inicio" },
  { ruta: "/nosotros", etiqueta: "Sobre INCA EDUCA (historia, misión)" },
  { ruta: "/contacto", etiqueta: "Contacto" },
];

async function construirContextoInstitucional(canal: CanalChat) {
  const carreras = await listarCarreras();
  const listaCarreras = carreras
    .map((c) => `- ${c.nombre} (${c.duracionMeses} meses)`)
    .join("\n");

  const rutasValidas = new Set(RUTAS_FIJAS.map((r) => r.ruta));
  let instruccionNavegacion = "";
  if (canal === "web") {
    for (const c of carreras) rutasValidas.add(`/carreras/${c.slug}`);

    const listaRutasCarreras = carreras
      .map((c) => `- Carrera "${c.nombre}": /carreras/${c.slug}`)
      .join("\n");
    const listaRutasFijas = RUTAS_FIJAS.map((r) => `- ${r.etiqueta}: ${r.ruta}`).join("\n");

    instruccionNavegacion = `

Páginas del sitio a las que puedes llevar al usuario cuando lo pida explícitamente (por ejemplo "muéstrame la carrera de gastronomía", "llévame a la galería", "quiero ver el proceso de admisión"):
${listaRutasCarreras}
${listaRutasFijas}

Cuando el mensaje del usuario sea un pedido de INTERACCIÓN con la página web (ver, mostrar, ir a, abrir una carrera o sección concreta de la lista de arriba), responde en "respuesta" con una frase breve confirmando, y llena "accion" con {"tipo":"navegar","ruta":"<la ruta EXACTA de la lista de arriba>"}.
Cuando el mensaje sea solo una pregunta que puedes responder con información (qué carreras hay, cuánto dura una carrera, costos, requisitos, etc.), responde normalmente en "respuesta" y deja "accion" en null.
Nunca inventes una ruta que no esté en la lista de arriba, y nunca pongas una acción si el usuario no pidió explícitamente ver o ir a algo.`;
  }

  const instruccionAsesor =
    canal === "whatsapp"
      ? "Si el postulante muestra interés real en una carrera y pide hablar con un asesor, pídele su nombre completo, DNI y la carrera que le interesa directamente aquí por chat, ya que estamos en WhatsApp. Una vez que tengas esos datos, indícale que un asesor se pondrá en contacto pronto."
      : "Si el postulante muestra interés real en una carrera y pide hablar con un asesor, NO le pidas su nombre, DNI o celular por chat. En vez de eso, dile brevemente que complete el formulario que aparece justo debajo del chat para conectarlo con un asesor.";

  const instruccionTono =
    canal === "whatsapp"
      ? "\n- Usa emojis con naturalidad para dar calidez a la conversación, como lo haría cualquier persona real chateando por WhatsApp (por ejemplo: saludos con 👋😊, temas de estudio con 📚🎓, confirmaciones con ✅👍, entusiasmo con 🙌). No tengas miedo de usarlos, pero evita ponerlos en cada palabra."
      : "";

  // Misma lógica y mismo diseño en ambos canales para esta lista puntual
  // (con el emoji 🎓 por línea, como en WhatsApp), aunque el resto del tono
  // del canal web siga sin emojis (instruccionTono arriba).
  const instruccionListasCarreras =
    "\n- Cuando menciones la lista completa de carreras disponibles, escribe cada una en su propia línea, precedida por el emoji 🎓 (por ejemplo:\n🎓 Gastronomía Internacional\n🎓 Hostelería y Turismo\n...). No las juntes en un solo párrafo separadas por comas o punto y coma.";

  const prompt = `Eres el asistente virtual de INCA EDUCA, un CETPRO (Centro de Educación Técnico-Productiva) en Cusco, Perú, fundado en 2002.

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
- Sé breve, cálido y claro.${instruccionNavegacion}`;

  return { prompt, rutasValidas };
}

interface MensajeChat {
  remitente: "postulante" | "agente";
  contenido: string;
}

// Esquema de salida estructurada para el canal web: el modelo clasifica cada
// mensaje entre "solo responder" (accion: null) o "interactuar con la
// página" (accion: navegar a una ruta real del sitio). El canal de WhatsApp
// no tiene a dónde navegar, así que sigue devolviendo texto plano.
const ESQUEMA_RESPUESTA_WEB = {
  type: "OBJECT",
  properties: {
    respuesta: { type: "STRING" },
    accion: {
      type: "OBJECT",
      nullable: true,
      properties: {
        tipo: { type: "STRING", enum: ["navegar"] },
        ruta: { type: "STRING" },
      },
      required: ["tipo", "ruta"],
    },
  },
  required: ["respuesta"],
};

export async function generarRespuestaAgente(
  historial: MensajeChat[],
  canal: CanalChat = "web"
): Promise<RespuestaAgente> {
  const { prompt: systemPrompt, rutasValidas } = await construirContextoInstitucional(canal);

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
      ...(canal === "web"
        ? {
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: ESQUEMA_RESPUESTA_WEB,
            },
          }
        : {}),
    }),
  });

  const data = await response.json();
  const texto = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!texto) {
    throw new Error("El agente no pudo generar una respuesta");
  }

  if (canal !== "web") {
    return { respuesta: texto as string, accion: null };
  }

  // El canal web pidió salida JSON estructurada. Si por algún motivo el
  // modelo no devolviera JSON válido (o lo envolviera en un bloque de código
  // ```json), se trata como texto plano en vez de romper la conversación.
  try {
    const textoLimpio = texto.trim().replace(/^```(?:json)?\s*/i, "").replace(/```$/, "").trim();
    const parsed = JSON.parse(textoLimpio);
    const respuesta = typeof parsed?.respuesta === "string" ? parsed.respuesta : texto;
    const rutaPropuesta = parsed?.accion?.ruta;
    const accion: AccionChatAgente | null =
      parsed?.accion?.tipo === "navegar" &&
      typeof rutaPropuesta === "string" &&
      rutasValidas.has(rutaPropuesta)
        ? { tipo: "navegar", ruta: rutaPropuesta }
        : null;
    return { respuesta, accion };
  } catch {
    return { respuesta: texto as string, accion: null };
  }
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
