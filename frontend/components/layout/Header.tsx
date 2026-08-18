"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const enlaces = [
  { href: "/", label: "Inicio" },
  { href: "/carreras", label: "Carreras" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
  { href: "/galeria", label: "Galería" },
];

export default function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [conScroll, setConScroll] = useState(false);

  useEffect(() => {
    const onScroll = () => setConScroll(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        conScroll ? "bg-[var(--color-verde-oscuro)]/90 backdrop-blur-md shadow-md" : "bg-[var(--color-verde-oscuro)] shadow-md"
      }`}
    >
      <div className="flex items-center justify-between px-4 sm:px-8 py-3 gap-2">
        <Link href="/" className="flex items-center" onClick={() => setMenuAbierto(false)}>
          <Image
            src="/logo.png"
            alt="INCA EDUCA"
            width={140}
            height={51}
            priority
            unoptimized
            className="h-auto w-[120px] sm:w-[140px]"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {enlaces.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className="px-4 py-2 rounded-full text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              {e.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/admision"
            className="rounded-full bg-[var(--color-naranja)] text-white text-sm font-bold px-4 sm:px-5 py-2.5 shadow-sm hover:brightness-95 hover:-translate-y-0.5 transition"
          >
            Postula ahora
          </Link>

          <button
            type="button"
            onClick={() => setMenuAbierto((v) => !v)}
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuAbierto}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 flex-shrink-0 rounded-full text-white hover:bg-white/10 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" aria-hidden="true">
              {menuAbierto ? (
                <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-out ${
          menuAbierto ? "max-h-80" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col px-4 sm:px-8 pb-4 pt-2 gap-1 border-t border-white/10">
          {enlaces.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              onClick={() => setMenuAbierto(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              {e.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
