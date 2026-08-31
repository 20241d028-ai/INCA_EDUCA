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

function formatearTiempo(segundos: number) {
  const min = Math.floor(segundos / 60);
  const seg = segundos % 60;
  return `${min}:${seg.toString().padStart(2, "0")}`;
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
  const [segundosGrabando, setSegundosGrabando] = useState(0);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mostrarFormAsesor, setMostrarFormAsesor] = useState(false);
  const finRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes, mostrarFormAsesor, previewUrl]);

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
      <button
        onClick={() => setAbierto((v) => !v)}
        aria-label={abierto ? "Cerrar chat" : "Abrir chat"}
        className={`fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-[var(--color-verde)] text-white shadow-lg items-center justify-center hover:brightness-95 transition ${
          abierto ? "hidden sm:flex" : "flex"
        }`}
      >
        {abierto ? "✕" : "💬"}
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
              ✕
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
                  🗑️
                </button>
                <button
                  onClick={confirmarEnvioAudio}
                  disabled={cargando}
                  aria-label="Enviar audio"
                  className="rounded-full w-9 h-9 flex items-center justify-center flex-shrink-0 bg-[var(--color-verde)] text-white disabled:opacity-50"
                >
                  →
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
                    grabando ? "bg-red-500 text-white scale-110" : "bg-[var(--color-fondo)] text-[var(--color-tinta)]"
                  }`}
                >
                  {grabando ? "⏹️" : "🎤"}
                </button>
                {!grabando && (
                  <button
                    onClick={enviarMensaje}
                    disabled={cargando}
                    className="rounded-full bg-[var(--color-verde)] text-white w-10 h-10 flex items-center justify-center disabled:opacity-50 flex-shrink-0"
                    aria-label="Enviar mensaje"
                  >
                    →
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