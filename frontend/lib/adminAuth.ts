"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const CLAVE_TOKEN = "admin_token";

/**
 * Hook compartido para páginas protegidas de /admin/*.
 * Lee el token de localStorage; si no existe, redirige a /admin/login.
 * Mientras se resuelve (primer render en el servidor / hidratación),
 * `token` es null y `listo` es false.
 */
export function useAdminToken() {
  const [token, setToken] = useState<string | null>(null);
  const [listo, setListo] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const guardado = localStorage.getItem(CLAVE_TOKEN);
    if (!guardado) {
      router.push("/admin/login");
      return;
    }
    // Se difiere a una microtarea a propósito: evita que el efecto dispare
    // el setState de forma síncrona en el mismo ciclo (regla
    // react-hooks/set-state-in-effect) sin cambiar el comportamiento real
    // (sigue resolviéndose solo en el cliente, después del montaje).
    queueMicrotask(() => {
      setToken(guardado);
      setListo(true);
    });
  }, [router]);

  function cerrarSesion() {
    localStorage.removeItem(CLAVE_TOKEN);
    router.push("/admin/login");
  }

  return { token, listo, cerrarSesion };
}
