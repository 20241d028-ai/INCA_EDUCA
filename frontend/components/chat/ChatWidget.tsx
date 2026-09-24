"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import {
  IconSend,
  IconMic,
  IconStop,
  IconTrash,
  IconX,
  IconGraduationCap,
  IconCalendar,
  IconBuilding,
  IconPhone,
  IconImage,
  IconWhatsApp,
} from "@/components/ui/Icons";
import { WHATSAPP_URL } from "@/lib/contacto";
import { formatDuracion, formatFechaInicio } from "@/lib/format";
import {
  enviarMensajeAgente,
  enviarMensajeAudio,
  crearPostulante,
  escalarConversacion,
  listarCarreras,
  type MensajeChat,
} from "@/lib/api";
import { detectarIntencion, type CarreraResumen, type Intencion } from "@/lib/chatIntents";

interface Mensaje extends MensajeChat {
  audioUrl?: string;
}

type IconoComponente = typeof IconGraduationCap;

type OpcionRapidaId = "carreras" | "fechas" | "galeria" | "nosotros" | "contacto";

// Menú inicial de accesos rápidos. Cada opción navega a una página real del
// sitio (no se inventan rutas ni secciones); cuando la página de destino
// tiene un id conocido (por ahora, solo "carreras" en /carreras) se hace
// scroll suave hacia él después de navegar.
const OPCIONES_RAPIDAS: { id: OpcionRapidaId; etiqueta: string; icono: IconoComponente }[] = [
  { id: "carreras", etiqueta: "Carreras", icono: IconGraduationCap },
  { id: "fechas", etiqueta: "Fechas de inicio", icono: IconCalendar },
  { id: "galeria", etiqueta: "Galería", icono: IconImage },
  { id: "nosotros", etiqueta: "Sobre INCA EDUCA", icono: IconBuilding },
  { id: "contacto", etiqueta: "Contacto", icono: IconPhone },
];

interface AccionSugerida {
  id: string;
  etiqueta: string;
  icono: IconoComponente;
  onClick: () => void;
}

function base64ToBlobUrl(base64: string, mime: string) {
  const byteChars = atob(base64);
  const byteArray = new Uint8Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
    byteArray[i] = byteChars.charCodeAt(i);
  }
  return URL.createObjectURL(new Blob([byteArray], { type: mime }));
}

function formatearTiempo(segundos: number) {
  const min = Math.floor(segundos / 60);
  const seg = segundos % 60;
  return `${min}:${seg.toString().padStart(2, "0")}`;
}

/** Botón pequeño en forma de chip, reutilizado tanto en el menú inicial como
 * en las sugerencias dinámicas que aparecen según el tema de la conversación. */
function ChipAccion({
  etiqueta,
  Icono,
  onClick,
}: {
  etiqueta: string;
  Icono: IconoComponente;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-verde)]/25 bg-white px-3.5 py-2 text-xs font-semibold text-[var(--color-tinta)] shadow-sm transition-all duration-200 ease-out hover:border-[var(--color-verde)] hover:bg-[var(--color-verde)] hover:text-white hover:-translate-y-0.5 hover:shadow-md"
    >
      <span className="inline-flex items-center justify-center w-7 h-7 flex-shrink-0 rounded-full bg-[var(--color-verde)]/10 text-[var(--color-verde)] transition-colors duration-200 group-hover:bg-white/20 group-hover:text-white">
        <Icono className="w-3.5 h-3.5" />
      </span>
      {etiqueta}
    </button>
  );
}

export default function ChatWidget() {
  const router = useRouter();
  const pathname = usePathname();

  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      remitente: "agente",
      contenido:
        "¡Hola! Soy el asistente virtual de INCA EDUCA. ¿En qué puedo ayudarte hoy?",
    },
  ]);
  const [input, setInput] = useState("");
  const [cargando, setCargando] = useState(false);
  const [grabando, setGrabando] = useState(false);
  const [segundosGrabando, setSegundosGrabando] = useState(0);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mostrarFormAsesor, setMostrarFormAsesor] = useState(false);

  // Estado del motor de intenciones: carreras cargadas para poder
  // reconocerlas en texto libre, la carrera "en contexto" para resolver
  // preguntas de seguimiento, y los bloques que se muestran según el tema
  // detectado (lista de carreras, tarjeta resumen o botones de acción).
  const [todasLasCarreras, setTodasLasCarreras] = useState<CarreraResumen[]>([]);
  const [carreraContexto, setCarreraContexto] = useState<CarreraResumen | null>(null);
  const [carrerasDisponibles, setCarrerasDisponibles] = useState<CarreraResumen[] | null>(null);
  const [carreraSeleccionada, setCarreraSeleccionada] = useState<CarreraResumen | null>(null);
  const [accionesSugeridas, setAccionesSugeridas] = useState<AccionSugerida[] | null>(null);

  const finRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Guarda el id de sección pendiente de scroll cuando la navegación
  // requiere cambiar de página primero (la sección vive en otra ruta).
  const scrollPendienteRef = useRef<string | null>(null);

  // El menú de accesos rápidos solo se muestra junto al mensaje de
  // bienvenida inicial; desaparece en cuanto la conversación avanza (el
  // usuario escribe, graba audio o toca una opción). A partir de ahí, las
  // sugerencias de botones cambian según el tema (accionesSugeridas).
  const mostrarMenuInicial = mensajes.length === 1 && !mostrarFormAsesor;

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes, mostrarFormAsesor, previewUrl, carrerasDisponibles, carreraSeleccionada, accionesSugeridas]);

  // Carga silenciosa de las carreras reales en segundo plano, para poder
  // reconocerlas en cualquier mensaje de texto libre desde el primer turno
  // (no solo cuando el usuario pulsa el botón "Carreras").
  useEffect(() => {
    listarCarreras()
      .then(setTodasLasCarreras)
      .catch(() => {});
  }, []);

  // Tras una navegación a otra página, si quedó pendiente un scroll hacia
  // una sección específica, se ejecuta una vez esa página termina de montar.
  useEffect(() => {
    if (!scrollPendienteRef.current) return;
    const idSeccion = scrollPendienteRef.current;
    scrollPendienteRef.current = null;
    const timer = setTimeout(() => {
      document.getElementById(idSeccion)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 250);
    return () => clearTimeout(timer);
  }, [pathname]);

  /**
   * Navega a `ruta` (si no estamos ya ahí) y hace scroll suave hasta
   * `idSeccion` cuando se indica. Reutiliza el router de Next.js del
   * proyecto; no crea rutas nuevas.
   */
  function irASeccion(ruta: string, idSeccion?: string) {
    if (pathname === ruta) {
      if (idSeccion) {
        document.getElementById(idSeccion)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }
    if (idSeccion) scrollPendienteRef.current = idSeccion;
    router.push(ruta);
  }

  async function cargarCarrerasChat() {
    setMensajes((prev) => [
      ...prev,
      { remitente: "agente", contenido: "Estas son nuestras carreras disponibles. Elige una para ver más detalles:" },
    ]);

    if (todasLasCarreras.length > 0) {
      setCarrerasDisponibles(todasLasCarreras);
      return;
    }

    setCargando(true);
    try {
      const lista = await listarCarreras();
      setTodasLasCarreras(lista);
      setCarrerasDisponibles(lista);
    } catch {
      setMensajes((prev) => [
        ...prev,
        { remitente: "agente", contenido: "No pude cargar las carreras en este momento. Intenta de nuevo en un momento." },
      ]);
    } finally {
      setCargando(false);
    }
  }

  function manejarFechas() {
    setMensajes((prev) => [
      ...prev,
      {
        remitente: "agente",
        contenido: "Las fechas de inicio se coordinan con un asesor al confirmar tu postulación. Puedes revisar el proceso de admisión aquí:",
      },
    ]);
    setAccionesSugeridas([
      { id: "ir-admision", etiqueta: "Ir a admisión", icono: IconCalendar, onClick: () => { setAccionesSugeridas(null); irASeccion("/admision"); } },
      { id: "contactar", etiqueta: "Contactar", icono: IconPhone, onClick: () => { setAccionesSugeridas(null); irASeccion("/contacto"); } },
    ]);
  }

  function manejarGaleria() {
    setMensajes((prev) => [...prev, { remitente: "agente", contenido: "Aquí puedes ver nuestra galería de fotos:" }]);
    setAccionesSugeridas([
      { id: "ver-galeria", etiqueta: "Ver galería", icono: IconImage, onClick: () => { setAccionesSugeridas(null); irASeccion("/galeria"); } },
    ]);
  }

  function manejarNosotros() {
    setMensajes((prev) => [...prev, { remitente: "agente", contenido: "Conoce más sobre nuestra institución:" }]);
    setAccionesSugeridas([
      { id: "ver-nosotros", etiqueta: "Sobre INCA EDUCA", icono: IconBuilding, onClick: () => { setAccionesSugeridas(null); irASeccion("/nosotros"); } },
    ]);
  }

  function manejarContacto() {
    setMensajes((prev) => [
      ...prev,
      { remitente: "agente", contenido: "Puedes escribirnos por WhatsApp o revisar nuestros datos de contacto:" },
    ]);
    setAccionesSugeridas([
      { id: "ir-contacto", etiqueta: "Ir a contacto", icono: IconPhone, onClick: () => { setAccionesSugeridas(null); irASeccion("/contacto"); } },
      {
        id: "whatsapp",
        etiqueta: "WhatsApp",
        icono: IconWhatsApp,
        onClick: () => {
          setAccionesSugeridas(null);
          window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer");
        },
      },
    ]);
  }

  function manejarMatricula() {
    setMensajes((prev) => [
      ...prev,
      {
        remitente: "agente",
        contenido: "Para matricularte, completa el formulario de admisión y un asesor confirmará contigo los siguientes pasos.",
      },
    ]);
    setAccionesSugeridas([
      { id: "ir-admision", etiqueta: "Información de matrícula", icono: IconCalendar, onClick: () => { setAccionesSugeridas(null); irASeccion("/admision"); } },
      { id: "contactar", etiqueta: "Contactar", icono: IconPhone, onClick: () => { setAccionesSugeridas(null); irASeccion("/contacto"); } },
    ]);
  }

  function manejarCostoGenerico() {
    setMensajes((prev) => [
      ...prev,
      { remitente: "agente", contenido: "Los costos varían según la carrera y se confirman con un asesor. ¿Sobre qué carrera quieres consultar?" },
    ]);
    cargarCarrerasChat();
  }

  function manejarCarreraEspecifica(carrera: CarreraResumen, subtema: "fecha" | "costo" | "general") {
    setCarreraContexto(carrera);
    setCarrerasDisponibles(null);

    const fechaInicio = formatFechaInicio(carrera.fechaInicio);

    let texto: string;
    if (subtema === "fecha") {
      texto = fechaInicio
        ? `${carrera.nombre} inicia el ${fechaInicio}.`
        : `Las fechas de inicio de ${carrera.nombre} se coordinan con un asesor al confirmar tu postulación.`;
    } else if (subtema === "costo") {
      texto = `Los costos y facilidades de pago de ${carrera.nombre} se confirman directamente con un asesor.`;
    } else {
      texto = `${carrera.nombre} — ${formatDuracion(carrera.duracionMeses)}.${
        carrera.descripcionCorta ? " " + carrera.descripcionCorta : ""
      }${fechaInicio ? ` Próximo inicio: ${fechaInicio}.` : ""}`;
    }

    setMensajes((prev) => [...prev, { remitente: "agente", contenido: texto }]);
    setCarreraSeleccionada(carrera);
  }

  function manejarAsesor() {
    setMensajes((prev) => [...prev, { remitente: "agente", contenido: "Con gusto. Completa estos datos para conectarte con un asesor:" }]);
    setMostrarFormAsesor(true);
  }

  // Limpia todos los paneles/botones ligados a un tema (sugerencias
  // dinámicas, lista de carreras, tarjeta de carrera seleccionada) para que
  // al cambiar de tema no queden botones de la conversación anterior. Cada
  // handler de intención vuelve a mostrar solo lo que corresponde a su
  // propio tema.
  function limpiarPanelesDeTema() {
    setAccionesSugeridas(null);
    setCarrerasDisponibles(null);
    setCarreraSeleccionada(null);
  }

  function ejecutarIntencion(intencion: Intencion) {
    limpiarPanelesDeTema();
    switch (intencion.tipo) {
      case "carreras":
        cargarCarrerasChat();
        break;
      case "carrera":
        manejarCarreraEspecifica(intencion.carrera, intencion.subtema);
        break;
      case "fechas":
        manejarFechas();
        break;
      case "galeria":
        manejarGaleria();
        break;
      case "nosotros":
        manejarNosotros();
        break;
      case "contacto":
        manejarContacto();
        break;
      case "matricula":
        manejarMatricula();
        break;
      case "costo":
        manejarCostoGenerico();
        break;
      case "asesor":
        manejarAsesor();
        break;
    }
  }

  function manejarOpcionRapida(idOpcion: OpcionRapidaId) {
    const opcion = OPCIONES_RAPIDAS.find((o) => o.id === idOpcion);
    if (!opcion) return;

    setMensajes((prev) => [...prev, { remitente: "postulante", contenido: opcion.etiqueta }]);

    const mapaIntencion: Record<OpcionRapidaId, Intencion> = {
      carreras: { tipo: "carreras" },
      fechas: { tipo: "fechas" },
      galeria: { tipo: "galeria" },
      nosotros: { tipo: "nosotros" },
      contacto: { tipo: "contacto" },
    };
    ejecutarIntencion(mapaIntencion[idOpcion]);
  }

  function seleccionarCarreraChat(carrera: CarreraResumen) {
    setCarrerasDisponibles(null);
    setCarreraContexto(carrera);
    setCarreraSeleccionada(carrera);
    setMensajes((prev) => [...prev, { remitente: "postulante", contenido: carrera.nombre }]);
  }

  function verCarreraChat(carrera: CarreraResumen) {
    setCarreraSeleccionada(null);
    setMensajes((prev) => [...prev, { remitente: "agente", contenido: "Aquí tienes toda la información 👇" }]);
    irASeccion(`/carreras/${carrera.slug}`);
  }

  async function enviarMensaje() {
    if (!input.trim() || cargando) return;
    const texto = input.trim();
    const nuevoHistorial: Mensaje[] = [
      ...mensajes,
      { remitente: "postulante", contenido: texto },
    ];
    setMensajes(nuevoHistorial);
    setInput("");

    // El motor de intenciones intercepta primero los temas que puede
    // resolver con datos y navegación reales del sitio (carreras, fechas,
    // galería, contacto, etc.). Si no reconoce nada, sigue el flujo normal
    // con el agente conversacional (Gemini) como hasta ahora.
    const intencion = detectarIntencion(texto, todasLasCarreras, carreraContexto);
    if (intencion.tipo !== "ninguna") {
      ejecutarIntencion(intencion);
      return;
    }

    // Aunque el motor de intenciones no reconoció nada y la respuesta la
    // dará Gemini, limpiamos los paneles/botones de un turno anterior (p.
    // ej. "Ver galería" o la lista de carreras) para que no queden pegados
    // a una respuesta sobre un tema distinto.
    limpiarPanelesDeTema();

    setCargando(true);
    try {
      const respuesta = await enviarMensajeAgente(nuevoHistorial);
      setMensajes((prev) => [...prev, { remitente: "agente", contenido: respuesta }]);
    } catch {
      setMensajes((prev) => [
        ...prev,
        {
          remitente: "agente",
          contenido: "Hubo un problema conectando con el asistente. Intenta de nuevo en un momento.",
        },
      ]);
    } finally {
      setCargando(false);
    }
  }

  async function iniciarGrabacion() {
    if (grabando || previewUrl) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const tiposCandidatos = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
      const tipoSoportado = tiposCandidatos.find((t) => MediaRecorder.isTypeSupported(t));

      const mediaRecorder = tipoSoportado
        ? new MediaRecorder(stream, { mimeType: tipoSoportado })
        : new MediaRecorder(stream);

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const tipoReal = mediaRecorder.mimeType || "audio/webm";
        const audioBlob = new Blob(chunksRef.current, { type: tipoReal });
        setPreviewBlob(audioBlob);
        setPreviewUrl(URL.createObjectURL(audioBlob));
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setGrabando(true);
      setSegundosGrabando(0);

      intervalRef.current = setInterval(() => {
        setSegundosGrabando((s) => s + 1);
      }, 1000);
    } catch {
      setMensajes((prev) => [
        ...prev,
        {
          remitente: "agente",
          contenido: "No pude acceder al micrófono. Revisa los permisos del navegador.",
        },
      ]);
    }
  }

  function detenerGrabacion() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setGrabando(false);
  }

  function descartarPreview() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewBlob(null);
    setPreviewUrl(null);
    setSegundosGrabando(0);
  }

  async function confirmarEnvioAudio() {
    if (!previewBlob) return;
    const blobAEnviar = previewBlob;
    descartarPreview();
    await enviarAudio(blobAEnviar);
  }

  async function enviarAudio(audioBlob: Blob) {
    setCargando(true);
    const audioUrl = URL.createObjectURL(audioBlob);
    const historialParaContexto = mensajes.map(({ remitente, contenido }) => ({
      remitente,
      contenido,
    }));

    setMensajes((prev) => [...prev, { remitente: "postulante", contenido: "", audioUrl }]);

    try {
      const { textoTranscrito, respuestaAudioBase64 } = await enviarMensajeAudio(
        audioBlob,
        historialParaContexto
      );
      const respuestaAudioUrl = base64ToBlobUrl(respuestaAudioBase64, "audio/wav");

      setMensajes((prev) => {
        const copia = [...prev];
        copia[copia.length - 1] = { remitente: "postulante", contenido: textoTranscrito, audioUrl };
        return [...copia, { remitente: "agente", contenido: "", audioUrl: respuestaAudioUrl }];
      });
    } catch {
      setMensajes((prev) => [
        ...prev,
        {
          remitente: "agente",
          contenido: "No pude procesar el audio. Intenta de nuevo o escribe tu mensaje.",
        },
      ]);
    } finally {
      setCargando(false);
    }
  }

  return (
    <>
      {!abierto && (
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escríbenos por WhatsApp"
          title="Escríbenos por WhatsApp"
          className="fixed bottom-24 right-6 z-50 h-[34px] w-[34px] rounded-full shadow-lg transition-transform duration-200 ease-out hover:scale-110"
        >
          <Image
            src="/social/whatsapp.png"
            alt="WhatsApp"
            width={34}
            height={34}
            unoptimized
            className="h-full w-full object-contain"
          />
        </a>
      )}

      <button
        onClick={() => setAbierto((v) => !v)}
        aria-label={abierto ? "Cerrar chat" : "Abrir chat"}
        title={abierto ? "Cerrar chat" : "Chat IA"}
        className={`fixed bottom-6 right-6 z-50 shadow-lg transition-all duration-300 ease-out hover:brightness-95 ${
          abierto
            ? "hidden sm:flex h-14 w-14 rounded-full bg-[var(--color-verde-oscuro)] text-white items-center justify-center"
            : "flex h-16 w-16 rounded-full overflow-hidden hover:scale-110 hover:-translate-y-0.5"
        }`}
      >
        {abierto ? (
          <IconX className="w-5 h-5" />
        ) : (
          <Image
            src="/chat/robot.gif"
            alt="Chat IA"
            width={64}
            height={64}
            unoptimized
            className="h-full w-full object-contain"
          />
        )}
      </button>

      {abierto && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 z-50 w-full sm:w-[380px] h-full sm:h-[560px] sm:max-w-[90vw] sm:max-h-[75vh] bg-white rounded-none sm:rounded-3xl shadow-2xl border-0 sm:border border-[var(--color-linea)] flex flex-col overflow-hidden">
          <div className="bg-[var(--color-verde)] text-white px-5 py-4 flex items-center justify-between gap-3 flex-shrink-0">
            <div>
              <p className="font-titulo font-semibold">Asistente INCA EDUCA</p>
              <p className="text-xs text-white/80">Responde según nuestras carreras y servicios</p>
            </div>
            <button
              onClick={() => setAbierto(false)}
              aria-label="Cerrar chat"
              className="sm:hidden flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <IconX className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {mensajes.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  m.remitente === "postulante"
                    ? "bg-[var(--color-verde)] text-white ml-auto rounded-br-sm"
                    : "bg-[var(--color-fondo)] text-[var(--color-tinta)] mr-auto rounded-bl-sm"
                }`}
              >
                {m.audioUrl ? (
                  <audio key={m.audioUrl} controls preload="auto" src={m.audioUrl} className="h-8 max-w-[220px]" />
                ) : (
                  m.contenido
                )}
              </div>
            ))}

            {mostrarMenuInicial && (
              <div className="mr-auto max-w-[95%] flex flex-wrap gap-2">
                {OPCIONES_RAPIDAS.map((o) => (
                  <ChipAccion key={o.id} etiqueta={o.etiqueta} Icono={o.icono} onClick={() => manejarOpcionRapida(o.id)} />
                ))}
              </div>
            )}

            {cargando && (
              <div className="bg-[var(--color-fondo)] text-[var(--color-tinta)] mr-auto rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm w-fit">
                Escribiendo…
              </div>
            )}

            {accionesSugeridas && (
              <div className="mr-auto max-w-[95%] flex flex-wrap gap-2">
                {accionesSugeridas.map((a) => (
                  <ChipAccion key={a.id} etiqueta={a.etiqueta} Icono={a.icono} onClick={a.onClick} />
                ))}
              </div>
            )}

            {carrerasDisponibles && (
              <div className="mr-auto max-w-[92%] bg-[var(--color-fondo)] rounded-2xl p-3.5 flex flex-wrap gap-2">
                {carrerasDisponibles.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => seleccionarCarreraChat(c)}
                    className="rounded-full bg-white border border-[var(--color-linea)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-verde-oscuro)] hover:border-[var(--color-verde)] hover:bg-[var(--color-verde)]/5 transition-colors"
                  >
                    {c.nombre}
                  </button>
                ))}
              </div>
            )}

            {carreraSeleccionada && (
              <div className="mr-auto max-w-[92%] bg-[var(--color-fondo)] rounded-2xl p-4 space-y-2 text-sm">
                <p className="font-titulo font-bold text-[var(--color-verde-oscuro)] text-base">
                  {carreraSeleccionada.nombre}
                </p>
                <p className="text-[var(--color-tinta)]/70">
                  Duración: {formatDuracion(carreraSeleccionada.duracionMeses)}
                </p>
                {carreraSeleccionada.descripcionCorta && (
                  <p className="text-[var(--color-tinta)]/70">{carreraSeleccionada.descripcionCorta}</p>
                )}
                {formatFechaInicio(carreraSeleccionada.fechaInicio) && (
                  <p className="font-semibold text-[var(--color-verde)]">
                    Inicia: {formatFechaInicio(carreraSeleccionada.fechaInicio)}
                  </p>
                )}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => verCarreraChat(carreraSeleccionada)}
                    className="flex-1 rounded-full bg-[var(--color-naranja)] text-white font-semibold py-2 hover:brightness-95 transition"
                  >
                    Ver carrera →
                  </button>
                  <button
                    onClick={() => irASeccion("/contacto")}
                    className="flex-1 rounded-full border border-[var(--color-verde)] text-[var(--color-verde-oscuro)] font-semibold py-2 hover:bg-[var(--color-verde)]/5 transition"
                  >
                    Consultar
                  </button>
                </div>
                <button
                  onClick={() => setCarreraSeleccionada(null)}
                  className="w-full text-center text-xs text-[var(--color-tinta)]/50 hover:text-[var(--color-tinta)]/70 pt-1"
                >
                  Cerrar
                </button>
              </div>
            )}

            {mostrarFormAsesor && (
              <FormularioAsesor
                mensajes={mensajes.map(({ remitente, contenido }) => ({ remitente, contenido }))}
                onCerrar={() => setMostrarFormAsesor(false)}
                onListo={(mensajeConfirmacion) =>
                  setMensajes((prev) => [
                    ...prev,
                    { remitente: "agente", contenido: mensajeConfirmacion },
                  ])
                }
              />
            )}

            <div ref={finRef} />
          </div>

          <div className="border-t border-[var(--color-linea)] p-3 flex-shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            {!mostrarFormAsesor && !grabando && !previewUrl && (
              <button
                onClick={() => setMostrarFormAsesor(true)}
                className="w-full mb-2 text-xs font-semibold text-[var(--color-naranja)] hover:underline"
              >
                ¿Quieres hablar con un asesor? Toca aquí
              </button>
            )}

            {previewUrl ? (
              <div className="flex items-center gap-2">
                <audio controls preload="auto" src={previewUrl} className="flex-1 h-9" />
                <button
                  onClick={descartarPreview}
                  aria-label="Descartar audio"
                  className="rounded-full w-9 h-9 flex items-center justify-center flex-shrink-0 bg-[var(--color-fondo)] text-[var(--color-tinta)]"
                >
                  <IconTrash className="w-4 h-4" />
                </button>
                <button
                  onClick={confirmarEnvioAudio}
                  disabled={cargando}
                  aria-label="Enviar audio"
                  className="rounded-full w-9 h-9 flex items-center justify-center flex-shrink-0 bg-[var(--color-verde)] text-white disabled:opacity-50"
                >
                  <IconSend className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                {grabando ? (
                  <div className="flex-1 flex items-center gap-2 rounded-full border border-red-300 bg-red-50 px-4 py-2.5 h-[38px]">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                    <span className="text-xs text-red-600 font-semibold">Escuchando…</span>
                    <span className="text-xs text-red-500 ml-auto tabular-nums">
                      {formatearTiempo(segundosGrabando)}
                    </span>
                  </div>
                ) : (
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && enviarMensaje()}
                    placeholder="Escribe tu mensaje…"
                    className="flex-1 rounded-full border border-[var(--color-linea)] px-4 py-2 text-sm outline-none focus:border-[var(--color-verde)]"
                  />
                )}
                <button
                  onClick={grabando ? detenerGrabacion : iniciarGrabacion}
                  aria-label={grabando ? "Detener grabación" : "Grabar un audio"}
                  className={`rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 transition ${
                    grabando ? "bg-red-500 text-white scale-110" : "bg-[var(--color-verde)] text-white"
                  }`}
                >
                  {grabando ? <IconStop className="w-4 h-4" /> : <IconMic className="w-4 h-4" />}
                </button>
                {!grabando && (
                  <button
                    onClick={enviarMensaje}
                    disabled={cargando}
                    className="rounded-full bg-[var(--color-naranja)] text-white w-10 h-10 flex items-center justify-center disabled:opacity-50 flex-shrink-0"
                    aria-label="Enviar mensaje"
                  >
                    <IconSend className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function FormularioAsesor({
  mensajes,
  onCerrar,
  onListo,
}: {
  mensajes: MensajeChat[];
  onCerrar: () => void;
  onListo: (mensaje: string) => void;
}) {
  const [nombreApellido, setNombreApellido] = useState("");
  const [dni, setDni] = useState("");
  const [celular, setCelular] = useState("");
  const [carreraId, setCarreraId] = useState("");
  const [carreras, setCarreras] = useState<{ id: string; nombre: string }[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    listarCarreras().then(setCarreras).catch(() => {});
  }, []);

  async function confirmar() {
    setError("");
    if (!nombreApellido || !dni || !celular || !carreraId) {
      setError("Completa todos los campos para continuar.");
      return;
    }
    setEnviando(true);
    try {
      const postulante = await crearPostulante({ nombreApellido, dni, celular, carreraId });
      await escalarConversacion(postulante.id, mensajes);
      onListo(
        "¡Listo! Un asesor de INCA EDUCA revisará tu conversación y te contactará muy pronto."
      );
      onCerrar();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ocurrió un error, intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="bg-[var(--color-fondo)] rounded-2xl p-4 space-y-2 text-sm">
      <p className="font-semibold">Cuéntanos quién eres para conectarte con un asesor:</p>
      <input
        value={nombreApellido}
        onChange={(e) => setNombreApellido(e.target.value)}
        placeholder="Nombre y apellido"
        className="w-full rounded-lg border border-[var(--color-linea)] px-3 py-2"
      />
      <input
        value={dni}
        onChange={(e) => setDni(e.target.value)}
        placeholder="DNI (8 dígitos)"
        maxLength={8}
        className="w-full rounded-lg border border-[var(--color-linea)] px-3 py-2"
      />
      <input
        value={celular}
        onChange={(e) => setCelular(e.target.value)}
        placeholder="Celular (9 dígitos)"
        maxLength={9}
        className="w-full rounded-lg border border-[var(--color-linea)] px-3 py-2"
      />
      <select
        value={carreraId}
        onChange={(e) => setCarreraId(e.target.value)}
        className="w-full rounded-lg border border-[var(--color-linea)] px-3 py-2"
      >
        <option value="">Carrera de interés</option>
        {carreras.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nombre}
          </option>
        ))}
      </select>
      {error && <p className="text-red-600 text-xs">{error}</p>}
      <div className="flex gap-2 pt-1">
        <button
          onClick={confirmar}
          disabled={enviando}
          className="flex-1 rounded-full bg-[var(--color-naranja)] text-white font-semibold py-2 disabled:opacity-50"
        >
          {enviando ? "Enviando…" : "Confirmar"}
        </button>
        <button onClick={onCerrar} className="px-3 text-[var(--color-tinta)]/70">
          Cancelar
        </button>
      </div>
    </div>
  );
}
