"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminToken } from "@/lib/adminAuth";
import AdminShell from "@/components/admin/AdminShell";
import {
  listarCarreras,
  actualizarFechaInicioCarrera,
  obtenerConfiguracionSitio,
  actualizarFechaInicioClasesGeneral,
  ApiAuthError,
  type CarreraApi,
} from "@/lib/api";
import { formatDuracion, formatFechaInicio } from "@/lib/format";

// Convierte el fechaInicio (ISO) que devuelve la API al formato que espera
// un <input type="date"> ("yyyy-mm-dd"), leyendo en UTC para que coincida
// con cómo se guarda y se muestra la fecha en el resto del sitio (ver
// formatFechaInicio en lib/format.ts) y no se corra un día por la zona
// horaria del navegador.
function aInputDate(fechaIso: string | null): string {
  if (!fechaIso) return "";
  const fecha = new Date(fechaIso);
  if (Number.isNaN(fecha.getTime())) return "";
  return fecha.toISOString().slice(0, 10);
}

export default function AdminCarrerasPage() {
  const { token, listo, cerrarSesion } = useAdminToken();
  const [carreras, setCarreras] = useState<CarreraApi[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [valores, setValores] = useState<Record<string, string>>({});
  const [guardandoId, setGuardandoId] = useState<string | null>(null);
  const [mensajeOkId, setMensajeOkId] = useState<string | null>(null);

  // Fecha de inicio de clases GENERAL de la institución (se muestra en la
  // sección de inicio de la web). Es independiente de la fecha por
  // carrera de la lista de abajo.
  const [fechaGeneralActual, setFechaGeneralActual] = useState<string | null>(null);
  const [valorGeneral, setValorGeneral] = useState("");
  const [guardandoGeneral, setGuardandoGeneral] = useState(false);
  const [okGeneral, setOkGeneral] = useState(false);

  const cargar = useCallback(() => {
    setCargando(true);
    Promise.all([listarCarreras(), obtenerConfiguracionSitio()])
      .then(([lista, config]) => {
        setCarreras(lista);
        setValores(Object.fromEntries(lista.map((c) => [c.id, aInputDate(c.fechaInicio)])));
        setFechaGeneralActual(config.fechaInicioClases);
        setValorGeneral(aInputDate(config.fechaInicioClases));
      })
      .catch(() => setError("No se pudieron cargar las carreras."))
      .finally(() => setCargando(false));
  }, []);

  useEffect(() => {
    // Diferido a una microtarea para no llamar setState de forma síncrona
    // dentro del efecto (regla react-hooks/set-state-in-effect), igual que
    // en /admin/galeria.
    queueMicrotask(cargar);
  }, [cargar]);

  async function guardar(id: string) {
    if (!token) return;
    setGuardandoId(id);
    setMensajeOkId(null);
    try {
      const valor = valores[id];
      const actualizado = await actualizarFechaInicioCarrera(id, valor ? valor : null, token);
      setCarreras((prev) => prev.map((c) => (c.id === id ? actualizado : c)));
      setMensajeOkId(id);
      setTimeout(() => setMensajeOkId((actual) => (actual === id ? null : actual)), 2000);
    } catch (err) {
      if (err instanceof ApiAuthError) {
        cerrarSesion();
        return;
      }
      alert(err instanceof Error ? err.message : "No se pudo guardar la fecha de inicio");
    } finally {
      setGuardandoId(null);
    }
  }

  async function quitar(id: string) {
    if (!token) return;
    setGuardandoId(id);
    try {
      const actualizado = await actualizarFechaInicioCarrera(id, null, token);
      setCarreras((prev) => prev.map((c) => (c.id === id ? actualizado : c)));
      setValores((prev) => ({ ...prev, [id]: "" }));
    } catch (err) {
      if (err instanceof ApiAuthError) {
        cerrarSesion();
        return;
      }
      alert(err instanceof Error ? err.message : "No se pudo quitar la fecha de inicio");
    } finally {
      setGuardandoId(null);
    }
  }

  async function guardarGeneral() {
    if (!token) return;
    setGuardandoGeneral(true);
    setOkGeneral(false);
    try {
      const config = await actualizarFechaInicioClasesGeneral(valorGeneral ? valorGeneral : null, token);
      setFechaGeneralActual(config.fechaInicioClases);
      setOkGeneral(true);
      setTimeout(() => setOkGeneral(false), 2000);
    } catch (err) {
      if (err instanceof ApiAuthError) {
        cerrarSesion();
        return;
      }
      alert(err instanceof Error ? err.message : "No se pudo guardar la fecha de inicio de clases");
    } finally {
      setGuardandoGeneral(false);
    }
  }

  async function quitarGeneral() {
    if (!token) return;
    setGuardandoGeneral(true);
    try {
      const config = await actualizarFechaInicioClasesGeneral(null, token);
      setFechaGeneralActual(config.fechaInicioClases);
      setValorGeneral("");
    } catch (err) {
      if (err instanceof ApiAuthError) {
        cerrarSesion();
        return;
      }
      alert(err instanceof Error ? err.message : "No se pudo quitar la fecha de inicio de clases");
    } finally {
      setGuardandoGeneral(false);
    }
  }

  if (!listo) {
    return <div className="min-h-screen flex items-center justify-center text-[var(--color-tinta)]/60">Cargando…</div>;
  }

  const cambioGeneralSinGuardar = valorGeneral !== aInputDate(fechaGeneralActual);

  return (
    <AdminShell titulo="Carreras" onSalir={cerrarSesion}>
      {/* Fecha de inicio de clases GENERAL (institucional, no por carrera) */}
      <div className="bg-[var(--color-verde-oscuro)] rounded-2xl p-5 sm:p-6">
        <h2 className="font-titulo font-bold text-white">Fecha de inicio de clases (general)</h2>
        <p className="mt-1 text-sm text-white/70">
          Se muestra en una franja destacada en la sección de inicio de la web, para todos los
          visitantes (no depende de ninguna carrera en particular).
        </p>

        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <input
            type="date"
            value={valorGeneral}
            onChange={(e) => setValorGeneral(e.target.value)}
            className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[var(--color-naranja)] [color-scheme:dark]"
          />
          <button
            type="button"
            onClick={guardarGeneral}
            disabled={guardandoGeneral || !cambioGeneralSinGuardar}
            className="rounded-full bg-[var(--color-naranja)] text-white text-sm font-semibold px-4 py-2 hover:brightness-95 transition disabled:opacity-50"
          >
            {guardandoGeneral ? "Guardando…" : okGeneral ? "Guardado ✓" : "Guardar"}
          </button>
          {fechaGeneralActual && (
            <button
              type="button"
              onClick={quitarGeneral}
              disabled={guardandoGeneral}
              className="text-xs font-bold text-white/70 hover:text-white hover:underline disabled:opacity-50"
            >
              Quitar
            </button>
          )}
        </div>
      </div>

      <p className="mt-8 text-[var(--color-tinta)]/70">
        Define también la fecha de inicio de cada carrera. Se muestra en cada tarjeta de
        carrera, en &quot;Postular ahora&quot;, en la ficha de la carrera y en las respuestas del
        chatbot. Déjala vacía para que siga diciendo que se confirma con un asesor.
      </p>

      {error && <p className="mt-4 text-sm font-semibold text-red-600">{error}</p>}
      {cargando && <p className="mt-4 text-[var(--color-tinta)]/60">Cargando…</p>}

      <div className="mt-6 flex flex-col gap-3">
        {carreras.map((c) => {
          const ocupado = guardandoId === c.id;
          const cambioSinGuardar = (valores[c.id] ?? "") !== aInputDate(c.fechaInicio);
          return (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-[var(--color-linea)] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5"
            >
              <div className="flex-1 min-w-0">
                <p className="font-titulo font-semibold text-[var(--color-verde-oscuro)]">{c.nombre}</p>
                <p className="text-xs text-[var(--color-tinta)]/50">
                  Duración: {formatDuracion(c.duracionMeses)}
                  {c.fechaInicio && ` · Inicia: ${formatFechaInicio(c.fechaInicio)}`}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="date"
                  value={valores[c.id] ?? ""}
                  onChange={(e) => setValores((prev) => ({ ...prev, [c.id]: e.target.value }))}
                  className="rounded-xl border border-[var(--color-linea)] px-3 py-2 text-sm outline-none focus:border-[var(--color-naranja)]"
                />
                <button
                  type="button"
                  onClick={() => guardar(c.id)}
                  disabled={ocupado || !cambioSinGuardar}
                  className="rounded-full bg-[var(--color-verde)] text-white text-sm font-semibold px-4 py-2 hover:brightness-95 transition disabled:opacity-50"
                >
                  {ocupado ? "Guardando…" : mensajeOkId === c.id ? "Guardado ✓" : "Guardar"}
                </button>
                {c.fechaInicio && (
                  <button
                    type="button"
                    onClick={() => quitar(c.id)}
                    disabled={ocupado}
                    className="text-xs font-bold text-red-600 hover:underline disabled:opacity-50"
                  >
                    Quitar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AdminShell>
  );
}
