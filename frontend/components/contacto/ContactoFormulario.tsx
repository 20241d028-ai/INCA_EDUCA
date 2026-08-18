"use client";

import { useState } from "react";
import FadeIn from "@/components/ui/FadeIn";
import { IconCheck, IconSend } from "@/components/ui/Icons";
import { MOTIVOS_CONSULTA, type MotivoConsulta } from "@/lib/contacto";

interface Errores {
  nombre?: string;
  correo?: string;
  telefono?: string;
  motivo?: string;
  mensaje?: string;
  privacidad?: string;
}

const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactoFormulario() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [motivo, setMotivo] = useState<MotivoConsulta | "">("");
  const [mensaje, setMensaje] = useState("");
  const [privacidad, setPrivacidad] = useState(false);

  const [errores, setErrores] = useState<Errores>({});
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  function validar(): Errores {
    const nuevosErrores: Errores = {};

    if (!nombre.trim()) {
      nuevosErrores.nombre = "Por favor, ingresa tu nombre completo.";
    }
    if (!correo.trim() || !REGEX_CORREO.test(correo.trim())) {
      nuevosErrores.correo = "Ingresa un correo electrónico válido.";
    }
    if (!/^\d{9}$/.test(telefono.trim())) {
      nuevosErrores.telefono = "Ingresa un teléfono válido (9 dígitos).";
    }
    if (!motivo) {
      nuevosErrores.motivo = "Selecciona el motivo de tu consulta.";
    }
    if (!mensaje.trim()) {
      nuevosErrores.mensaje = "Cuéntanos brevemente en qué podemos ayudarte.";
    }
    if (!privacidad) {
      nuevosErrores.privacidad =
        "Debes aceptar el tratamiento de tus datos para continuar.";
    }

    return nuevosErrores;
  }

  async function manejarEnvio(e: React.FormEvent) {
    e.preventDefault();

    const nuevosErrores = validar();
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setEnviando(true);

    // TODO(backend): esta sección todavía no tiene un endpoint de contacto.
    // Cuando exista (ver el patrón de crearPostulante en lib/api.ts), reemplazar
    // este bloque por la llamada real, por ejemplo:
    //   await enviarConsultaContacto({ nombre, correo, telefono, motivo, mensaje });
    // Los datos ya están validados y listos para enviarse tal cual.
    await new Promise((resolve) => setTimeout(resolve, 500));

    setEnviando(false);
    setEnviado(true);
  }

  if (enviado) {
    return (
      <section id="formulario" className="bg-white py-20 scroll-mt-24">
        <div className="max-w-2xl mx-auto px-6">
          <FadeIn>
            <div className="rounded-3xl border border-[var(--color-linea)] bg-[var(--color-fondo)] px-8 py-14 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-[var(--color-verde)]/10 text-[var(--color-verde)] flex items-center justify-center">
                <IconCheck className="w-9 h-9" />
              </div>
              <h3 className="mt-6 font-titulo text-2xl font-extrabold text-[var(--color-verde-oscuro)]">
                Mensaje enviado correctamente
              </h3>
              <p className="mt-3 text-[var(--color-tinta)]/70 leading-relaxed max-w-md mx-auto">
                Gracias por comunicarte con INCA EDUCA. Nos pondremos en contacto
                contigo pronto.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
    );
  }

  return (
    <section id="formulario" className="bg-white py-20 scroll-mt-24">
      <div className="max-w-3xl mx-auto px-6">
        <FadeIn>
          <h2 className="font-titulo text-3xl md:text-4xl font-extrabold text-[var(--color-verde-oscuro)] text-center">
            Cuéntanos cómo podemos ayudarte
          </h2>
          <p className="mt-3 text-[var(--color-tinta)]/70 text-center max-w-xl mx-auto">
            Escríbenos y nuestro equipo se pondrá en contacto contigo.
          </p>
        </FadeIn>

        <FadeIn delay={100}>
          <form onSubmit={manejarEnvio} noValidate className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-[var(--color-tinta)] mb-1">
                Nombre completo
              </label>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. María Quispe"
                className={`w-full rounded-xl border px-4 py-2.5 outline-none transition-colors focus:border-[var(--color-verde)] ${
                  errores.nombre ? "border-red-400" : "border-[var(--color-linea)]"
                }`}
              />
              {errores.nombre && <p className="mt-1.5 text-sm text-red-600">{errores.nombre}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--color-tinta)] mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
                className={`w-full rounded-xl border px-4 py-2.5 outline-none transition-colors focus:border-[var(--color-verde)] ${
                  errores.correo ? "border-red-400" : "border-[var(--color-linea)]"
                }`}
              />
              {errores.correo && <p className="mt-1.5 text-sm text-red-600">{errores.correo}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--color-tinta)] mb-1">
                Teléfono
              </label>
              <input
                value={telefono}
                onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ""))}
                placeholder="9 dígitos"
                maxLength={9}
                inputMode="numeric"
                className={`w-full rounded-xl border px-4 py-2.5 outline-none transition-colors focus:border-[var(--color-verde)] ${
                  errores.telefono ? "border-red-400" : "border-[var(--color-linea)]"
                }`}
              />
              {errores.telefono && <p className="mt-1.5 text-sm text-red-600">{errores.telefono}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--color-tinta)] mb-1">
                Motivo de consulta
              </label>
              <select
                value={motivo}
                onChange={(e) => setMotivo(e.target.value as MotivoConsulta)}
                className={`w-full rounded-xl border px-4 py-2.5 outline-none transition-colors focus:border-[var(--color-verde)] ${
                  errores.motivo ? "border-red-400" : "border-[var(--color-linea)]"
                }`}
              >
                <option value="">Selecciona un motivo</option>
                {MOTIVOS_CONSULTA.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              {errores.motivo && <p className="mt-1.5 text-sm text-red-600">{errores.motivo}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-[var(--color-tinta)] mb-1">
                Mensaje
              </label>
              <textarea
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Cuéntanos en qué podemos ayudarte…"
                rows={5}
                className={`w-full rounded-xl border px-4 py-2.5 outline-none transition-colors resize-none focus:border-[var(--color-verde)] ${
                  errores.mensaje ? "border-red-400" : "border-[var(--color-linea)]"
                }`}
              />
              {errores.mensaje && <p className="mt-1.5 text-sm text-red-600">{errores.mensaje}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="flex items-start gap-2 text-sm text-[var(--color-tinta)]/80">
                <input
                  type="checkbox"
                  checked={privacidad}
                  onChange={(e) => setPrivacidad(e.target.checked)}
                  className="mt-1"
                />
                Acepto el tratamiento de mis datos de acuerdo con la política de
                privacidad.
              </label>
              {errores.privacidad && (
                <p className="mt-1.5 text-sm text-red-600">{errores.privacidad}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={enviando}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-naranja)] text-white font-bold px-8 py-3.5 shadow-md transition-all duration-300 ease-out hover:brightness-95 hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0"
              >
                <IconSend className="w-4 h-4" />
                {enviando ? "Enviando…" : "Enviar consulta →"}
              </button>
            </div>
          </form>
        </FadeIn>
      </div>
    </section>
  );
}
