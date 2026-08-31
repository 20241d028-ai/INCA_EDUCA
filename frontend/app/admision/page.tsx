"use client";

import { useEffect, useState } from "react";
import { crearPostulante, listarCarreras } from "@/lib/api";

export default function AdmisionPage() {
  const [carreras, setCarreras] = useState<{ id: string; nombre: string }[]>([]);
  const [nombreApellido, setNombreApellido] = useState("");
  const [dni, setDni] = useState("");
  const [celular, setCelular] = useState("");
  const [carreraId, setCarreraId] = useState("");
  const [consentimiento, setConsentimiento] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);

  useEffect(() => {
    listarCarreras()
      .then(setCarreras)
      .catch(() => setError("No se pudieron cargar las carreras. Intenta recargar la página."));
  }, []);

  async function manejarEnvio(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!nombreApellido || !dni || !celular || !carreraId) {
      setError("Completa todos los campos para continuar.");
      return;
    }
    if (!/^\d{8}$/.test(dni)) {
      setError("El DNI debe tener 8 dígitos.");
      return;
    }
    if (!/^\d{9}$/.test(celular)) {
      setError("El celular debe tener 9 dígitos.");
      return;
    }
    if (!consentimiento) {
      setError("Debes aceptar el tratamiento de tus datos personales para continuar.");
      return;
    }

    setEnviando(true);
    try {
      await crearPostulante({
        nombreApellido,
        dni,
        celular,
        carreraId,
        origen: "formulario",
        consentimientoDatos: consentimiento,
      });
      setExito(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ocurrió un error, intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  if (exito) {
    return (
      <main className="pt-24 pb-20 max-w-2xl mx-auto px-6 text-center">
        <h1 className="font-titulo text-3xl md:text-4xl font-bold text-[var(--color-tinta)]">
          ¡Postulación enviada!
        </h1>
        <p className="mt-4 text-[var(--color-tinta)]/70 leading-relaxed">
          Gracias por tu interés en INCA EDUCA. Un asesor revisará tus datos y
          se pondrá en contacto contigo muy pronto.
        </p>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-20 max-w-2xl mx-auto px-6">
      <h1 className="font-titulo text-4xl font-bold text-[var(--color-tinta)]">
        Postula ahora
      </h1>
      <p className="mt-2 text-[var(--color-tinta)]/70">
        Completa el formulario y un asesor de INCA EDUCA te contactará para
        continuar con tu inscripción.
      </p>

      <form onSubmit={manejarEnvio} className="mt-10 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[var(--color-tinta)] mb-1">
            Nombre y apellido
          </label>
          <input
            value={nombreApellido}
            onChange={(e) => setNombreApellido(e.target.value)}
            placeholder="Ej. María Quispe"
            className="w-full rounded-xl border border-[var(--color-linea)] px-4 py-2.5 outline-none focus:border-[var(--color-verde)]"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[var(--color-tinta)] mb-1">
            DNI
          </label>
          <input
            value={dni}
            onChange={(e) => setDni(e.target.value.replace(/\D/g, ""))}
            placeholder="8 dígitos"
            maxLength={8}
            inputMode="numeric"
            className="w-full rounded-xl border border-[var(--color-linea)] px-4 py-2.5 outline-none focus:border-[var(--color-verde)]"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[var(--color-tinta)] mb-1">
            Celular
          </label>
          <input
            value={celular}
            onChange={(e) => setCelular(e.target.value.replace(/\D/g, ""))}
            placeholder="9 dígitos"
            maxLength={9}
            inputMode="numeric"
            className="w-full rounded-xl border border-[var(--color-linea)] px-4 py-2.5 outline-none focus:border-[var(--color-verde)]"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[var(--color-tinta)] mb-1">
            Carrera de interés
          </label>
          <select
            value={carreraId}
            onChange={(e) => setCarreraId(e.target.value)}
            className="w-full rounded-xl border border-[var(--color-linea)] px-4 py-2.5 outline-none focus:border-[var(--color-verde)]"
          >
            <option value="">Selecciona una carrera</option>
            {carreras.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-start gap-2 text-sm text-[var(--color-tinta)]/80">
          <input
            type="checkbox"
            checked={consentimiento}
            onChange={(e) => setConsentimiento(e.target.checked)}
            className="mt-1"
          />
          Acepto el tratamiento de mis datos personales para ser contactado por
          INCA EDUCA.
        </label>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={enviando}
          className="w-full rounded-full bg-[var(--color-verde)] text-white font-semibold py-3 hover:brightness-95 transition disabled:opacity-50"
        >
          {enviando ? "Enviando…" : "Enviar postulación"}
        </button>
      </form>
    </main>
  );
}
