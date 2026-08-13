import Image from "next/image";
import Link from "next/link";

const enlaces = [
  { href: "/", label: "Inicio" },
  { href: "/carreras", label: "Carreras" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/noticias", label: "Noticias" },
  { href: "/galeria", label: "Galería" },
];

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#3A3937]/95 flex items-center justify-between px-8 py-3 shadow-md">
      <Link href="/" className="flex items-center">
        <Image
          src="/logo.png"
          alt="INCA EDUCA"
          width={140}
          height={48}
          priority
          className="h-auto w-[140px]"
        />
      </Link>

      <nav className="hidden md:flex items-center gap-2">
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

      <Link
        href="/admision"
        className="rounded-full bg-[var(--color-naranja)] text-white text-sm font-bold px-5 py-2.5 hover:brightness-95 transition"
      >
        Postula ahora
      </Link>
    </header>
  );
}