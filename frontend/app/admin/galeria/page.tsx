"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAdminToken } from "@/lib/adminAuth";
import AdminShell from "@/components/admin/AdminShell";
import { listarGaleriaAdmin, subirGaleria, actualizarGaleria, eliminarGaleria, ApiAuthError } from "@/lib/api";
import { CATEGORIAS_GALERIA, CATEGORIA_GALERIA_META, type CategoriaGaleria, type GaleriaItem } from "@/lib/galeria";
import { IconUpload, IconStar, IconEye, IconEyeOff, IconPencil } from "@/components/ui/Icons";

interface FormEdicion {
  titulo: string;
  evento: string;
  categoria: CategoriaGaleria | "";
  orden: string;
}

export default function AdminGaleriaPage() {
  const { token, listo, cerrarSesion } = useAdminToken();
  const [items, setItems] = useState<GaleriaItem[]>([]);
  const [cargandoLista, setCargandoLista] = useState(true);
  const [error, setError] = useState("");

  const [titulo, setTitulo] = useState("");
  const [evento, setEvento] = useState("");
  const [tipo, setTipo] = useState<"foto" | "video">("foto");
  const [categoria, setCategoria] = useState<CategoriaGaleria | "">("");
  const [destacado, setDestacado] = useState(false);
  const [orden, setOrden] = useState("0");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [errorForm, setErrorForm] = useState("");
  const inputArchivoRef = useRef<HTMLInputElement>(null);

  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [formEdicion, setFormEdicion] = useState<FormEdicion | null>(null);
  const [guardandoEdicion, setGuardandoEdicion] = useState(false);
  const [idEnAccion, setIdEnAccion] = useState<string | null>(null);

  const cargar = useCallback(() => {
    if (!token) return;
    setCargandoLista(true);
    listarGaleriaAdmin(token)
      .then(setItems)
      .catch((e) => {
        if (e instanceof ApiAuthError) {
          cerrarSesion();
          return;
        }
        setError(e.message);
      })
      .finally(() => setCargandoLista(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (!token) return;
    queueMicrotask(cargar);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !archivo) {
      setErrorForm("Selecciona un archivo antes de subir");
      return;
    }
    setErrorForm("");
    setSubiendo(true);
    try {
      await subirGaleria(
        {
          titulo,
          evento,
          tipo,
          categoria: categoria || undefined,
          destacado,
          orden: Number(orden) || 0,
          archivo,
        },
        token
      );
      setTitulo("");
      setEvento("");
      setCategoria("");
      setDestacado(false);
      setOrden("0");
      setArchivo(null);
      if (inputArchivoRef.current) inputArchivoRef.current.value = "";
      cargar();
    } catch (err) {
      if (err instanceof ApiAuthError) {
        cerrarSesion();
        return;
      }
      setErrorForm(err instanceof Error ? err.message : "No se pudo subir el archivo");
    } finally {
      setSubiendo(false);
    }
  }

  async function handleEliminar(id: string) {
    if (!token) return;
    if (!confirm("¿Eliminar este elemento de la galería? Esta acción no se puede deshacer.")) return;
    try {
      await eliminarGaleria(id, token);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      if (err instanceof ApiAuthError) {
        cerrarSesion();
        return;
      }
      alert(err instanceof Error ? err.message : "No se pudo eliminar");
    }
  }

  async function alternarCampo(item: GaleriaItem, campo: "activo" | "destacado") {
    if (!token) return;
    setIdEnAccion(item.id);
    try {
      const actualizado = await actualizarGaleria(item.id, { [campo]: !item[campo] }, token);
      setItems((prev) => prev.map((i) => (i.id === item.id ? actualizado : i)));
    } catch (err) {
      if (err instanceof ApiAuthError) {
        cerrarSesion();
        return;
      }
      alert(err instanceof Error ? err.message : "No se pudo actualizar");
    } finally {
      setIdEnAccion(null);
    }
  }

  function abrirEdicion(item: GaleriaItem) {
    setEditandoId(item.id);
    setFormEdicion({
      titulo: item.titulo,
      evento: item.evento,
      categoria: item.categoria ?? "",
      orden: String(item.orden),
    });
  }

  async function guardarEdicion(id: string) {
    if (!token || !formEdicion) return;
    setGuardandoEdicion(true);
    try {
      const actualizado = await actualizarGaleria(
        id,
        {
          titulo: formEdicion.titulo,
          evento: formEdicion.evento,
          categoria: formEdicion.categoria,
          orden: Number(formEdicion.orden) || 0,
        },
        token
      );
      setItems((prev) => prev.map((i) => (i.id === id ? actualizado : i)));
      setEditandoId(null);
      setFormEdicion(null);
    } catch (err) {
      if (err instanceof ApiAuthError) {
        cerrarSesion();
        return;
      }
      alert(err instanceof Error ? err.message : "No se pudo guardar los cambios");
    } finally {
      setGuardandoEdicion(false);
    }
  }

  if (!listo) {
    return <div className="min-h-screen flex items-center justify-center text-[var(--color-tinta)]/60">Cargando…</div>;
  }

  return (
    <AdminShell titulo="Galería" onSalir={cerrarSesion}>
      {/* Formulario de subida */}
      <div className="bg-white rounded-2xl border border-[var(--color-linea)] p-6 shadow-sm">
        <h2 className="font-titulo font-bold text-lg text-[var(--color-verde-oscuro)]">
          Subir nuevo elemento
        </h2>

        <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            className="rounded-xl border border-[var(--color-linea)] px-4 py-2.5 text-sm outline-none transition focus:border-[var(--color-naranja)] focus:ring-2 focus:ring-[var(--color-naranja)]/20"
          />
          <input
            type="text"
            placeholder="Descripción / evento (ej. Graduación 2026)"
            value={evento}
            onChange={(e) => setEvento(e.target.value)}
            required
            className="rounded-xl border border-[var(--color-linea)] px-4 py-2.5 text-sm outline-none transition focus:border-[var(--color-naranja)] focus:ring-2 focus:ring-[var(--color-naranja)]/20"
          />

          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as "foto" | "video")}
            className="rounded-xl border border-[var(--color-linea)] px-4 py-2.5 text-sm outline-none transition focus:border-[var(--color-naranja)]"
          >
            <option value="foto">Foto</option>
            <option value="video">Video</option>
          </select>

          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value as CategoriaGaleria | "")}
            className="rounded-xl border border-[var(--color-linea)] px-4 py-2.5 text-sm outline-none transition focus:border-[var(--color-naranja)]"
          >
            <option value="">Sin categoría (no aparece en ningún carrusel)</option>
            {CATEGORIAS_GALERIA.map((c) => (
              <option key={c} value={c}>
                {CATEGORIA_GALERIA_META[c].etiqueta}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2 text-sm font-semibold text-[var(--color-tinta)]">
            <input
              type="number"
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              className="w-24 rounded-xl border border-[var(--color-linea)] px-3 py-2 text-sm outline-none transition focus:border-[var(--color-naranja)]"
            />
            Orden (menor aparece primero)
          </label>

          <label className="flex items-center gap-2 text-sm font-semibold text-[var(--color-tinta)] cursor-pointer">
            <input
              type="checkbox"
              checked={destacado}
              onChange={(e) => setDestacado(e.target.checked)}
              className="w-4 h-4 accent-[var(--color-naranja)]"
            />
            Destacar en &quot;Momentos que quedan&quot;
          </label>

          <div className="sm:col-span-2 flex items-center gap-3 flex-wrap">
            <label
              htmlFor="archivo-galeria"
              className="inline-flex items-center gap-2 rounded-full border-2 border-dashed border-[var(--color-verde)] text-[var(--color-verde-oscuro)] font-bold text-sm px-5 py-2.5 cursor-pointer transition hover:bg-[var(--color-verde)]/10"
            >
              <IconUpload className="w-4 h-4" />
              Elegir archivo de la computadora
            </label>
            <input
              ref={inputArchivoRef}
              id="archivo-galeria"
              type="file"
              accept={tipo === "video" ? "video/*" : "image/*"}
              onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
              required
              className="sr-only"
            />
            <span className="text-sm text-[var(--color-tinta)]/60 truncate">
              {archivo ? archivo.name : "Ningún archivo seleccionado"}
            </span>
          </div>

          {errorForm && <p className="sm:col-span-2 text-sm font-semibold text-red-600">{errorForm}</p>}

          <button
            type="submit"
            disabled={subiendo}
            className="sm:col-span-2 rounded-full bg-[var(--color-naranja)] text-white font-bold py-2.5 transition hover:brightness-95 disabled:opacity-60"
          >
            {subiendo ? "Subiendo…" : "Subir a la galería"}
          </button>
        </form>
      </div>

      {/* Listado existente */}
      <h2 className="mt-8 font-titulo font-bold text-lg text-[var(--color-verde-oscuro)]">
        Elementos actuales
      </h2>
      <p className="text-sm text-[var(--color-tinta)]/50">
        Los inactivos no se muestran en la galería pública, pero quedan aquí para poder reactivarlos.
      </p>

      {error && <p className="mt-2 text-sm font-semibold text-red-600">{error}</p>}
      {cargandoLista && <p className="mt-3 text-[var(--color-tinta)]/60">Cargando…</p>}

      {!cargandoLista && items.length === 0 && !error && (
        <div className="mt-3 bg-white rounded-2xl border border-[var(--color-linea)] py-14 text-center text-[var(--color-tinta)]/60">
          Todavía no hay elementos en la galería.
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const enEdicion = editandoId === item.id;
          const ocupado = idEnAccion === item.id;
          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border overflow-hidden shadow-sm transition ${
                item.activo ? "border-[var(--color-linea)]" : "border-red-200"
              }`}
            >
              <div className="relative aspect-video bg-[var(--color-linea)]">
                {item.tipo === "video" ? (
                  <video src={item.url} className="w-full h-full object-cover" muted />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.url}
                    alt={item.titulo}
                    className={`w-full h-full object-cover ${!item.activo ? "opacity-40 grayscale" : ""}`}
                  />
                )}

                <div className="absolute top-2 left-2 flex gap-1.5">
                  {item.destacado && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-naranja)] text-white text-[11px] font-bold px-2 py-1">
                      <IconStar className="w-3 h-3" />
                      Destacada
                    </span>
                  )}
                  {!item.activo && (
                    <span className="rounded-full bg-red-600 text-white text-[11px] font-bold px-2 py-1">
                      Inactivo
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3">
                {enEdicion && formEdicion ? (
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={formEdicion.titulo}
                      onChange={(e) => setFormEdicion({ ...formEdicion, titulo: e.target.value })}
                      placeholder="Título"
                      className="rounded-lg border border-[var(--color-linea)] px-3 py-1.5 text-sm outline-none focus:border-[var(--color-naranja)]"
                    />
                    <input
                      type="text"
                      value={formEdicion.evento}
                      onChange={(e) => setFormEdicion({ ...formEdicion, evento: e.target.value })}
                      placeholder="Descripción / evento"
                      className="rounded-lg border border-[var(--color-linea)] px-3 py-1.5 text-sm outline-none focus:border-[var(--color-naranja)]"
                    />
                    <select
                      value={formEdicion.categoria}
                      onChange={(e) =>
                        setFormEdicion({ ...formEdicion, categoria: e.target.value as CategoriaGaleria | "" })
                      }
                      className="rounded-lg border border-[var(--color-linea)] px-3 py-1.5 text-sm outline-none focus:border-[var(--color-naranja)]"
                    >
                      <option value="">Sin categoría</option>
                      {CATEGORIAS_GALERIA.map((c) => (
                        <option key={c} value={c}>
                          {CATEGORIA_GALERIA_META[c].etiqueta}
                        </option>
                      ))}
                    </select>
                    <label className="flex items-center gap-2 text-xs font-semibold text-[var(--color-tinta)]/70">
                      Orden:
                      <input
                        type="number"
                        value={formEdicion.orden}
                        onChange={(e) => setFormEdicion({ ...formEdicion, orden: e.target.value })}
                        className="w-20 rounded-lg border border-[var(--color-linea)] px-2 py-1 text-sm outline-none focus:border-[var(--color-naranja)]"
                      />
                    </label>
                    <div className="flex gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => guardarEdicion(item.id)}
                        disabled={guardandoEdicion}
                        className="flex-1 rounded-full bg-[var(--color-verde)] text-white text-xs font-bold py-1.5 hover:brightness-95 transition disabled:opacity-60"
                      >
                        {guardandoEdicion ? "Guardando…" : "Guardar"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditandoId(null);
                          setFormEdicion(null);
                        }}
                        className="flex-1 rounded-full bg-[var(--color-fondo)] text-[var(--color-tinta)] text-xs font-bold py-1.5 hover:bg-[var(--color-linea)] transition"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-bold text-[var(--color-tinta)] truncate">{item.titulo}</p>
                    <p className="text-xs text-[var(--color-tinta)]/50 truncate">
                      {item.categoria ? CATEGORIA_GALERIA_META[item.categoria].etiqueta : "Sin categoría"} · Orden {item.orden}
                    </p>

                    <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => abrirEdicion(item)}
                        title="Editar"
                        className="inline-flex items-center gap-1 rounded-full border border-[var(--color-linea)] text-[var(--color-tinta)] text-xs font-bold px-2.5 py-1.5 hover:border-[var(--color-naranja)] hover:text-[var(--color-naranja)] transition"
                      >
                        <IconPencil className="w-3.5 h-3.5" />
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => alternarCampo(item, "activo")}
                        disabled={ocupado}
                        title={item.activo ? "Desactivar" : "Activar"}
                        className="inline-flex items-center gap-1 rounded-full border border-[var(--color-linea)] text-[var(--color-tinta)] text-xs font-bold px-2.5 py-1.5 hover:border-[var(--color-verde)] hover:text-[var(--color-verde)] transition disabled:opacity-50"
                      >
                        {item.activo ? <IconEyeOff className="w-3.5 h-3.5" /> : <IconEye className="w-3.5 h-3.5" />}
                        {item.activo ? "Desactivar" : "Activar"}
                      </button>
                      <button
                        type="button"
                        onClick={() => alternarCampo(item, "destacado")}
                        disabled={ocupado}
                        title={item.destacado ? "Quitar destacado" : "Destacar"}
                        className={`inline-flex items-center gap-1 rounded-full border text-xs font-bold px-2.5 py-1.5 transition disabled:opacity-50 ${
                          item.destacado
                            ? "border-[var(--color-naranja)] text-[var(--color-naranja)]"
                            : "border-[var(--color-linea)] text-[var(--color-tinta)] hover:border-[var(--color-naranja)] hover:text-[var(--color-naranja)]"
                        }`}
                      >
                        <IconStar className="w-3.5 h-3.5" />
                        {item.destacado ? "Destacada" : "Destacar"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEliminar(item.id)}
                        className="ml-auto text-xs font-bold text-red-600 hover:underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AdminShell>
  );
}
