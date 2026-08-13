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
      router.push("/admin/conversaciones");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div style={{ maxWidth: 320, margin: "80px auto", fontFamily: "sans-serif" }}>
      <h1>Login Admin</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={cargando} style={{ width: "100%", padding: 10 }}>
          {cargando ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}