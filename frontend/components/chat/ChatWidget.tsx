"use client";

import { useState, useRef, useEffect } from "react";
import {
  enviarMensajeAgente,
  enviarMensajeAudio,
  crearPostulante,
  escalarConversacion,
  listarCarreras,
  type MensajeChat,
} from "@/lib/api";

interface Mensaje extends MensajeChat {
  audioUrl?: string;
}

function base64ToBlobUrl(base64: string, mime: string) {
  const byteChars = atob(base64);
  const byteArray = new Uint8Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
    byteArray[i] = byteChars.charCodeAt(i);
  }
  return URL.createObjectURL(new Blob([byteArray], { type: mime }));
}

export default function ChatWidget() {
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
  const [mostrarFormAsesor, setMostrarFormAsesor] = useState(false);
  const finRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes, mostrarFormAsesor]);

  async function enviarMensaje() {
    if (!input.trim() || cargando) return;
    const nuevoHistorial: Mensaje[] = [
      ...mensajes,
      { remitente: "postulante", contenido: input },
    ];
    setMensajes(nuevoHistorial);
    setInput("");
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


  function detenerGrabacion() {
    mediaRecorderRef.current?.stop();
    setGrabando(false);
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
      <button
        onClick={() => setAbierto((v) => !v)}
        aria-label={abierto ? "Cerrar chat" : "Abrir chat"}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-[var(--color-verde)] text-white shadow-lg flex items-center justify-center hover:brightness-95 transition"
      >
        {abierto ? "✕" : "💬"}
      </button>

      {abierto && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[90vw] h-[520px] max-h-[75vh] bg-white rounded-3xl shadow-2xl border border-[var(--color-linea)] flex flex-col overflow-hidden">
          <div className="bg-[var(--color-verde)] text-white px-5 py-4">
            <p className="font-titulo font-bold">Asistente INCA EDUCA</p>
            <p className="text-xs text-white/80">Responde según nuestras carreras y servicios</p>
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
                  <audio controls src={m.audioUrl} className="h-8 max-w-[220px]" />
                ) : (
                  m.contenido
                )}
              </div>
            ))}
            {cargando && (
              <div className="bg-[var(--color-fondo)] text-[var(--color-tinta)] mr-auto rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm w-fit">
                Escribiendo…
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

          <div className="border-t border-[var(--color-linea)] p-3">
            {!mostrarFormAsesor && (
              <button
                onClick={() => setMostrarFormAsesor(true)}
                className="w-full mb-2 text-xs font-semibold text-[var(--color-naranja)] hover:underline"
              >
                ¿Quieres hablar con un asesor? Toca aquí
              </button>
            )}
            <div className="flex gap-2 items-center">
              {grabando ? (
                <div className="flex-1 flex items-center gap-1 rounded-full border border-red-300 bg-red-50 px-4 py-2.5 h-[38px]">
                  <span className="text-xs text-red-600 font-semibold mr-1">Escuchando</span>
                  <span className="flex items-end gap-0.5 h-4">
                    <span className="w-0.5 bg-red-500 rounded-full animate-[eq1_0.6s_ease-in-out_infinite]" />
                    <span className="w-0.5 bg-red-500 rounded-full animate-[eq2_0.5s_ease-in-out_infinite]" />
                    <span className="w-0.5 bg-red-500 rounded-full animate-[eq3_0.7s_ease-in-out_infinite]" />
                    <span className="w-0.5 bg-red-500 rounded-full animate-[eq2_0.5s_ease-in-out_infinite]" />
                    <span className="w-0.5 bg-red-500 rounded-full animate-[eq1_0.6s_ease-in-out_infinite]" />
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
                onMouseDown={iniciarGrabacion}
                onMouseUp={detenerGrabacion}
                onMouseLeave={() => grabando && detenerGrabacion()}
                onTouchStart={iniciarGrabacion}
                onTouchEnd={detenerGrabacion}
                aria-label="Mantén presionado para grabar un audio"
                className={`rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 transition ${
                  grabando ? "bg-red-500 text-white scale-110" : "bg-[var(--color-fondo)] text-[var(--color-tinta)]"
                }`}
              >
                🎤
              </button>
              <button
                onClick={enviarMensaje}
                disabled={cargando || grabando}
                className="rounded-full bg-[var(--color-verde)] text-white w-10 h-10 flex items-center justify-center disabled:opacity-50 flex-shrink-0"
                aria-label="Enviar mensaje"
              >
                →
              </button>
            </div>
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
}}