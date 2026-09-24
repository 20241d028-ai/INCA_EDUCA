// Motor de intenciones del chatbot de INCA EDUCA.
//
// Es deliberadamente basado en reglas (coincidencia de palabras clave y
// nombres reales de carreras), no un modelo de lenguaje nuevo: el backend
// ya usa Gemini para texto libre (ver Backend/src/modules/chat/service.ts),
// así que este motor solo intercepta los mensajes cuyo tema puede resolverse
// con datos y navegación reales del sitio (mostrar botones, ir a una
// sección, mostrar una carrera). Cuando no reconoce nada, devuelve
// { tipo: "ninguna" } y ChatWidget sigue usando la respuesta de Gemini como
// hasta ahora — el motor nunca reemplaza esa vía, solo la complementa.
//
// No inventa carreras, precios ni fechas: la lista de carreras llega desde
// la API real (lib/api.ts → listarCarreras) y las respuestas para
// fechas/costos remiten a "un asesor" porque esos datos no existen como
// campos reales en el modelo (ver lib/carrerasContenido.ts).

import type { listarCarreras } from "@/lib/api";

export type CarreraResumen = Awaited<ReturnType<typeof listarCarreras>>[number];

export type Intencion =
  | { tipo: "carreras" }
  | { tipo: "carrera"; carrera: CarreraResumen; subtema: "fecha" | "costo" | "general" }
  | { tipo: "fechas" }
  | { tipo: "galeria" }
  | { tipo: "nosotros" }
  | { tipo: "contacto" }
  | { tipo: "matricula" }
  | { tipo: "costo" }
  | { tipo: "asesor" }
  | { tipo: "ninguna" };

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

function palabras(texto: string): string[] {
  return normalizar(texto)
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

const CONECTORES = new Set(["de", "y", "la", "el", "los", "las", "del", "en", "a", "para", "e"]);

function contieneAlguna(textoNorm: string, frases: string[]): boolean {
  return frases.some((f) => textoNorm.includes(normalizar(f)));
}

// Sinónimos coloquiales que la gente usa para referirse a una carrera sin
// decir su nombre oficial completo (p. ej. "computación" → "Operador de
// Computadoras"). Se activan solo si la raíz aparece en el nombre real de
// la carrera devuelta por la API — nunca añaden carreras que no existan.
const SINONIMOS_POR_RAIZ: { raiz: string; sinonimos: string[] }[] = [
  { raiz: "computador", sinonimos: ["computacion", "compu", "informatica", "sistemas", "pc"] },
  { raiz: "gastronom", sinonimos: ["cocina", "chef", "culinaria", "cocinero", "cocinar"] },
  { raiz: "hosteleria", sinonimos: ["hotel", "hoteleria"] },
  { raiz: "turismo", sinonimos: ["turistica", "guia turistico", "guia de turismo"] },
  { raiz: "pasteleria", sinonimos: ["reposteria", "pasteles", "postres"] },
  { raiz: "panaderia", sinonimos: ["pan", "hornear", "panadero"] },
  { raiz: "cosmetolog", sinonimos: ["estetica", "belleza", "peluqueria", "maquillaje", "barberia"] },
  { raiz: "administrativ", sinonimos: ["administracion", "oficina", "secretariado", "secretaria"] },
  { raiz: "logistica", sinonimos: ["almacen", "inventario", "despacho"] },
];

export function detectarCarreraEnTexto(texto: string, carreras: CarreraResumen[]): CarreraResumen | null {
  const textoNorm = normalizar(texto);
  if (!textoNorm || carreras.length === 0) return null;

  for (const carrera of carreras) {
    const nombreNorm = normalizar(carrera.nombre);
    if (nombreNorm && textoNorm.includes(nombreNorm)) return carrera;
  }

  for (const carrera of carreras) {
    const tokensSignificativos = palabras(carrera.nombre).filter(
      (p) => p.length >= 4 && !CONECTORES.has(p)
    );
    if (tokensSignificativos.some((t) => textoNorm.includes(t))) return carrera;
  }

  for (const carrera of carreras) {
    const nombreNorm = normalizar(carrera.nombre);
    for (const { raiz, sinonimos } of SINONIMOS_POR_RAIZ) {
      if (nombreNorm.includes(raiz) && sinonimos.some((s) => textoNorm.includes(s))) {
        return carrera;
      }
    }
  }

  return null;
}

const FRASES_ASESOR = [
  "hablar con un asesor",
  "hablar con alguien",
  "atencion personalizada",
  "quiero un asesor",
  "comunicarme con una persona",
  "hablar con una persona",
];
const FRASES_FECHA = [
  "cuando empiez",
  "cuando inicia",
  "cuando comienza",
  "fecha de inicio",
  "fechas de inicio",
  "inicio de clases",
  "cuando son las clases",
  "cuando abren",
];
const FRASES_COSTO = [
  "cuanto cuesta",
  "cuanto vale",
  "cuanto pagar",
  "cuanto es",
  "precio",
  "costo",
  "pension",
  "mensualidad",
];
const FRASES_GALERIA = ["foto", "imagen", "galeria"];
const FRASES_MATRICULA = ["matricul", "inscribirme", "inscripcion", "como postulo", "como me inscribo"];
const FRASES_CONTACTO = [
  "numero de telefono",
  "su telefono",
  "como los contacto",
  "correo electronico",
  "su correo",
  "direccion",
  "ubicacion",
  "donde quedan",
  "donde estan ubicados",
  "whatsapp",
];
const FRASES_CARRERAS_TODAS = [
  "que carreras",
  "carreras disponibles",
  "carreras tienen",
  "que estudian",
  "que opciones",
  "que ofrecen",
  "ver carreras",
  "lista de carreras",
  "listado de carreras",
  "todas las carreras",
];

// Coincide con cualquier forma de la palabra "carrera" (carrera, carreras,
// carrerita, etc.) como palabra completa, no como subcadena de otra
// palabra. Es la señal más amplia y genérica: cualquier mensaje que
// mencione "carrera(s)" sin nombrar una carrera concreta ni encajar en una
// intención más específica (costo, fecha, matrícula...) debe entenderse
// como "quiero ver las carreras" y mostrar el botón correspondiente.
const PATRON_PALABRA_CARRERA = /\bcarrer\w*/;
const FRASES_NOSOTROS = [
  "quienes son",
  "sobre inca educa",
  "sobre la institucion",
  "historia de inca",
  "mision y vision",
  "conocer la institucion",
  "que es inca educa",
];

/**
 * Analiza un mensaje de texto libre y decide si corresponde una acción
 * conocida (carrera, sección, botón) o si debe seguir el flujo normal con
 * el backend (Gemini). `carreraContexto` es la última carrera mencionada en
 * la conversación, para resolver preguntas de seguimiento como
 * "¿cuánto cuesta?" sin que el usuario repita el nombre de la carrera.
 */
export function detectarIntencion(
  texto: string,
  carreras: CarreraResumen[],
  carreraContexto: CarreraResumen | null
): Intencion {
  const textoNorm = normalizar(texto);
  if (!textoNorm) return { tipo: "ninguna" };

  if (contieneAlguna(textoNorm, FRASES_ASESOR)) return { tipo: "asesor" };

  const carreraEnTexto = detectarCarreraEnTexto(texto, carreras);
  if (carreraEnTexto) {
    if (contieneAlguna(textoNorm, FRASES_FECHA)) {
      return { tipo: "carrera", carrera: carreraEnTexto, subtema: "fecha" };
    }
    if (contieneAlguna(textoNorm, FRASES_COSTO)) {
      return { tipo: "carrera", carrera: carreraEnTexto, subtema: "costo" };
    }
    return { tipo: "carrera", carrera: carreraEnTexto, subtema: "general" };
  }

  // Sin mención explícita de carrera: si hay una carrera en contexto y la
  // pregunta es claramente de seguimiento (fecha/costo), se resuelve contra
  // ella en vez de pedir de nuevo toda la información.
  if (carreraContexto) {
    if (contieneAlguna(textoNorm, FRASES_FECHA)) {
      return { tipo: "carrera", carrera: carreraContexto, subtema: "fecha" };
    }
    if (contieneAlguna(textoNorm, FRASES_COSTO)) {
      return { tipo: "carrera", carrera: carreraContexto, subtema: "costo" };
    }
  }

  if (contieneAlguna(textoNorm, FRASES_GALERIA)) return { tipo: "galeria" };
  if (contieneAlguna(textoNorm, FRASES_FECHA)) return { tipo: "fechas" };
  if (contieneAlguna(textoNorm, FRASES_MATRICULA)) return { tipo: "matricula" };
  if (contieneAlguna(textoNorm, FRASES_COSTO)) return { tipo: "costo" };
  if (contieneAlguna(textoNorm, FRASES_CONTACTO)) return { tipo: "contacto" };
  if (contieneAlguna(textoNorm, FRASES_CARRERAS_TODAS)) return { tipo: "carreras" };
  if (contieneAlguna(textoNorm, FRASES_NOSOTROS)) return { tipo: "nosotros" };

  // Red de seguridad final: si el mensaje menciona la palabra "carrera(s)"
  // de cualquier forma (p. ej. "muéstrame carreras", "quiero ver las
  // carreras", "info de carreras") y no encajó en ninguna intención más
  // específica de arriba (costo, fecha, matrícula, una carrera puntual,
  // etc.), se interpreta como pedido de ver el listado de carreras en vez
  // de dejarlo pasar a la respuesta genérica de Gemini sin ningún botón.
  if (PATRON_PALABRA_CARRERA.test(textoNorm)) return { tipo: "carreras" };

  return { tipo: "ninguna" };
}
