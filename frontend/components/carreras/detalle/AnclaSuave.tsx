"use client";

import type { ReactNode, MouseEvent } from "react";

// Enlace ancla con scroll suave hacia una sección de la misma página,
// sin depender de scroll-behavior global (no toca globals.css).
export default function AnclaSuave({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <a href={href} onClick={onClick} className={className}>
      {children}
    </a>
  );
}
