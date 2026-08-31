"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/lib/api";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      const { token } = await loginAdmin(email, password);
      localStorage.setItem("admin_token", token);
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-fondo)] px-6">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-[var(--color-linea)] shadow-sm p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-tinta)]/40">
          Panel administrativo
        </p>
        <h1 className="font-titulo text-2xl font-semibold text-[var(--color-verde-oscuro)]">
          INCA EDUCA
        </h1>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-[var(--color-linea)] px-4 py-2.5 text-sm outline-none transition focus:border-[var(--color-naranja)] focus:ring-2 focus:ring-[var(--color-naranja)]/20"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl border border-[var(--color-linea)] px-4 py-2.5 text-sm outline-none transition focus:border-[var(--color-naranja)] focus:ring-2 focus:ring-[var(--color-naranja)]/20"
          />

          {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={cargando}
            className="mt-2 w-full rounded-full bg-[var(--color-naranja)] text-white font-semibold py-2.5 transition hover:brightness-95 disabled:opacity-60"
          >
            {cargando ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
