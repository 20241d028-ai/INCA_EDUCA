import Image from "next/image";
import Link from "next/link";
import { WHATSAPP_URL } from "@/lib/contacto";

const ENLACES_INSTITUCION = [
  { href: "/nosotros", label: "Nosotros" },
  { href: "/carreras", label: "Carreras" },
  { href: "/galeria", label: "Galería" },
];

const ENLACES_INFORMACION = [
  { href: "/contacto", label: "Contacto" },
  { href: "/admision", label: "Admisión" },
];

const REDES = [
  { href: "https://www.facebook.com/IncaEduca?locale=es_LA", label: "Facebook", src: "/social/facebook.png" },
  { href: "https://www.instagram.com/incaeduca/", label: "Instagram", src: "/social/instagram.png" },
  { href: "https://www.tiktok.com/@incaeduca?is_from_webapp=1&sender_device=pc", label: "TikTok", src: "/social/tiktok.png" },
  { href: WHATSAPP_URL, label: "WhatsApp", src: "/social/whatsapp.png" },
];

export default function Footer() {
  const anio = new Date().getFullYear();

  return (
    <footer className="bg-[#3A3937] text-white/80">
      <div className="max-w-6xl mx-auto px-8 py-4 grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-x-10 gap-y-3">
        <div>
          <Image
            src="/logo.png"
            alt="INCA EDUCA"
            width={110}
            height={40}
            unoptimized
            className="h-auto w-[110px]"
          />
          <p className="mt-1 font-titulo font-semibold text-sm text-white/90">
            Formando profesionales para construir el futuro.
          </p>
          <p className="mt-1 text-xs leading-tight text-white/60">
            Centro de Educación Técnico-Productiva en Cusco, formando
            profesionales técnicos en turismo y gastronomía desde 2002.
          </p>

          <div id="contacto" className="mt-1.5 flex flex-col gap-0.5 text-xs leading-tight text-white/60 scroll-mt-28">
            <p>Teléfono: (084) 275994 · Correo: info@incaeduca.edu.pe</p>
            <p>Prol. Av. la Cultura, 6º paradero San Sebastián, Cusco</p>
          </div>
        </div>

        <div>
          <h3 className="font-titulo font-bold text-sm text-white">Institución</h3>
          <nav className="mt-1.5 flex flex-col gap-1">
            {ENLACES_INSTITUCION.map((e) => (
              <Link
                key={e.href}
                href={e.href}
                className="text-xs text-white/60 hover:text-white transition-colors w-fit"
              >
                {e.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h3 className="font-titulo font-bold text-sm text-white">Información</h3>
          <nav className="mt-1.5 flex flex-col gap-1">
            {ENLACES_INFORMACION.map((e) => (
              <Link
                key={e.href}
                href={e.href}
                className="text-xs text-white/60 hover:text-white transition-colors w-fit"
              >
                {e.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h3 className="font-titulo font-bold text-sm text-white">Síguenos</h3>
          <div className="mt-1.5 flex flex-col gap-1">
            {REDES.map((r) => (
              <Link
                key={r.label}
                href={r.href}
                target={r.href.startsWith("http") ? "_blank" : undefined}
                rel={r.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-2 text-xs text-white/70 hover:text-white transition-colors w-fit"
              >
                <Image src={r.src} alt="" width={16} height={16} unoptimized className="w-4 h-4 object-contain" />
                {r.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-1.5">
        <p className="text-center text-[11px] text-white/50">
          © {anio} INCA EDUCA. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
