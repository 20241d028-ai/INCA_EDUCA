import Image from "next/image";
import Link from "next/link";
import { IconFacebook, IconInstagram, IconTikTok, IconWhatsApp } from "@/components/ui/Icons";

const ENLACES_INSTITUCION = [
  { href: "/nosotros", label: "Nosotros" },
  { href: "/carreras", label: "Carreras" },
  { href: "/galeria", label: "Galería" },
];

const ENLACES_INFORMACION = [
  { href: "/contacto", label: "Contacto" },
  { href: "/admision", label: "Admisión" },
];

// TODO: reemplazar "#" por las URLs reales de cada red social cuando existan.
const REDES = [
  { href: "#", label: "Facebook", icono: IconFacebook },
  { href: "#", label: "Instagram", icono: IconInstagram },
  { href: "#", label: "TikTok", icono: IconTikTok },
  { href: "#", label: "WhatsApp", icono: IconWhatsApp },
];

export default function Footer() {
  const anio = new Date().getFullYear();

  return (
    <footer className="bg-[#3A3937] text-white/80">
      <div className="max-w-6xl mx-auto px-8 py-7 grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-x-10 gap-y-6">
        <div>
          <Image
            src="/logo.png"
            alt="INCA EDUCA"
            width={140}
            height={51}
            unoptimized
            className="h-auto w-[140px]"
          />
          <p className="mt-2 font-titulo font-bold text-white/90">
            Formando profesionales para construir el futuro.
          </p>
          <p className="mt-1 text-sm leading-snug text-white/60">
            Centro de Educación Técnico-Productiva en Cusco, formando
            profesionales técnicos en turismo y gastronomía desde 2002.
          </p>

          <div id="contacto" className="mt-3 flex flex-col gap-1 text-sm text-white/60 scroll-mt-28">
            <p>Teléfono: (084) 275994</p>
            <p>Correo: info@incaeduca.edu.pe</p>
            <p>Prol. Av. la Cultura, 6º paradero San Sebastián, Cusco</p>
          </div>
        </div>

        <div>
          <h3 className="font-titulo font-bold text-white">Institución</h3>
          <nav className="mt-2 flex flex-col gap-1.5">
            {ENLACES_INSTITUCION.map((e) => (
              <Link
                key={e.href}
                href={e.href}
                className="text-sm text-white/60 hover:text-white transition-colors w-fit"
              >
                {e.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h3 className="font-titulo font-bold text-white">Información</h3>
          <nav className="mt-2 flex flex-col gap-1.5">
            {ENLACES_INFORMACION.map((e) => (
              <Link
                key={e.href}
                href={e.href}
                className="text-sm text-white/60 hover:text-white transition-colors w-fit"
              >
                {e.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h3 className="font-titulo font-bold text-white">Síguenos</h3>
          <div className="mt-2 flex flex-col gap-1.5">
            {REDES.map((r) => {
              const Icono = r.icono;
              return (
                <Link
                  key={r.label}
                  href={r.href}
                  className="inline-flex items-center gap-2.5 text-sm text-white/60 hover:text-white transition-colors w-fit"
                >
                  <Icono className="w-4 h-4" />
                  {r.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-2.5">
        <p className="text-center text-xs text-white/50">
          © {anio} INCA EDUCA. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
