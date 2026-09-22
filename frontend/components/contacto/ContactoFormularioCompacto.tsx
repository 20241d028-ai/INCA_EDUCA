"use client";

import { useState } from "react";
import { IconCheck, IconSend } from "@/components/ui/Icons";
import { MOTIVOS_CONSULTA, type MotivoConsulta } from "@/lib/contacto";
import { enviarConsultaContacto } from "@/lib/api";

interface Errores {
  nombre?: string;
  correo?: string;
  telefono?: string;
  motivo?: string;
  mensaje?: string;
  privacidad?: string;
}

const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CAMPO =
  "w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-verde)]";

/**
 * Versión compacta del formulario de contacto, pensada para vivir dentro
 * del Hero (columna derecha, más angosta). Misma validación y mismo
 * endpoint que ContactoFormulario — solo cambia la densidad visual.
 */
export default function ContactoFormularioCompacto() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [motivo, setMotivo] = useState<MotivoConsulta | "">("");
  const [mensaje, setMensaje] = useState("");
  const [privacidad, setPrivacidad] = useState(false);

  const [errores, setErrores] = useState<Errores>({});
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState("");

  function validar(): Errores {
    const nuevosErrores: Errores = {};

    if (!nombre.trim()) nuevosErrores.nombre = "Ingresa tu nombre.";
    if (!correo.trim() || !REGEX_CORREO.test(correo.trim())) {
      nuevosErrores.correo = "Correo no válido.";
    }
    if (!/^\d{9}$/.test(telefono.trim())) {
      nuevosErrores.telefono = "Teléfono no válido (9 dígitos).";
    }
    if (!motivo) nuevosErrores.motivo = "Selecciona un motivo.";
    if (!mensaje.trim()) nuevosErrores.mensaje = "Cuéntanos brevemente tu consulta.";
    if (!privacidad) nuevosErrores.privacidad = "Debes aceptar el tratamiento de tus datos.";

    return nuevosErrores;
  }

  async function manejarEnvio(e: React.FormEvent) {
    e.preventDefault();

    const nuevosErrores = validar();
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setErrorEnvio("");
    setEnviando(true);

    try {
      await enviarConsultaContacto({
        nombre: nombre.trim(),
        correo: correo.trim(),
        telefono: telefono.trim(),
        motivo,
        mensaje: mensaje.trim(),
      });
      setEnviado(true);
    } catch (error) {
      setErrorEnvio(
        error instanceof Error ? error.message : "No se pudo enviar tu mensaje. Intenta nuevamente."
      );
    } finally {
      setEnviando(false);
    }
  }

  if (enviado) {
    return (
      <div className="rounded-3xl bg-white shadow-2xl p-7 sm:p-8 text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-[var(--color-verde)]/10 text-[var(--color-verde)] flex items-center justify-center">
          <IconCheck className="w-7 h-7" />
        </div>
        <h3 className="mt-5 font-titulo text-xl font-bold text-[var(--color-verde-oscuro)]">
          Mensaje enviado
        </h3>
        <p className="mt-2 text-sm text-[var(--color-tinta)]/70 leading-relaxed">
          Gracias por escribirnos. Nos pondremos en contacto contigo pronto.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white shadow-2xl p-6 sm:p-7">
      <h3 className="font-titulo text-lg sm:text-xl font-bold text-[var(--color-verde-oscuro)]">
        Escríbenos
      </h3>
      <p className="mt-1 text-sm text-[var(--color-tinta)]/60">
        Te respondemos a la brevedad.
      </p>

      <form onSubmit={manejarEnvio} noValidate className="mt-5 flex flex-col gap-3.5">
        <div>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre completo"
            aria-label="Nombre completo"
            className={`${CAMPO} ${errores.nombre ? "border-red-400" : "border-[var(--color-linea)]"}`}
          />
          {errores.nombre && <p className="mt-1 text-xs text-red-600">{errores.nombre}</p>}
        </div>

        <div>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="Correo electrónico"
            aria-label="Correo electrónico"
            className={`${CAMPO} ${errores.correo ? "border-red-400" : "border-[var(--color-linea)]"}`}
          />
          {errores.correo && <p className="mt-1 text-xs text-red-600">{errores.correo}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              value={telefono}
              onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ""))}
              placeholder="Teléfono"
              aria-label="Teléfono"
              maxLength={9}
              inputMode="numeric"
              className={`${CAMPO} ${errores.telefono ? "border-red-400" : "border-[var(--color-linea)]"}`}
            />
            {errores.telefono && <p className="mt-1 text-xs text-red-600">{errores.telefono}</p>}
          </div>

          <div>
            <select
              value={motivo}
              onChange={(e) => setMotivo(e.target.value as MotivoConsulta)}
              aria-label="Motivo de consulta"
              className={`${CAMPO} ${errores.motivo ? "border-red-400" : "border-[var(--color-linea)]"}`}
            >
              <option value="">Motivo</option>
              {MOTIVOS_CONSULTA.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            {errores.motivo && <p className="mt-1 text-xs text-red-600">{errores.motivo}</p>}
          </div>
        </div>

        <div>
          <textarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Cuéntanos en qué podemos ayudarte…"
            aria-label="Mensaje"
            rows={3}
            className={`${CAMPO} resize-none ${errores.mensaje ? "border-red-400" : "border-[var(--color-linea)]"}`}
          />
          {errores.mensaje && <p className="mt-1 text-xs text-red-600">{errores.mensaje}</p>}
        </div>

        <div>
          <label className="flex items-start gap-2 text-xs text-[var(--color-tinta)]/70 leading-snug">
            <input
              type="checkbox"
              checked={privacidad}
              onChange={(e) => setPrivacidad(e.target.checked)}
              className="mt-0.5"
            />
            Acepto el tratamiento de mis datos según la política de privacidad.
          </label>
          {errores.privacidad && <p className="mt-1 text-xs text-red-600">{errores.privacidad}</p>}
        </div>

        {errorEnvio && <p className="text-xs text-red-600">{errorEnvio}</p>}

        <button
          type="submit"
          disabled={enviando}
          className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-naranja)] text-white font-semibold text-sm px-6 py-3 shadow-md transition-all duration-300 ease-out hover:brightness-95 hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0"
        >
          <IconSend className="w-3.5 h-3.5" />
          {enviando ? "Enviando…" : "Enviar consulta →"}
        </button>
      </form>
    </div>
  );
}
