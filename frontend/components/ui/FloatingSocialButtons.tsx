import Image from "next/image";

const REDES = [
  {
    href: "https://www.facebook.com/IncaEduca?locale=es_LA",
    label: "Facebook",
    src: "/social/facebook.png",
  },
  {
    href: "https://www.instagram.com/incaeduca/",
    label: "Instagram",
    src: "/social/instagram.png",
  },
  {
    href: "https://www.tiktok.com/@incaeduca?is_from_webapp=1&sender_device=pc",
    label: "TikTok",
    src: "/social/tiktok.png",
  },
];

export default function FloatingSocialButtons() {
  return (
    <div className="fixed left-4 sm:left-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3">
      {REDES.map((r) => (
        <a
          key={r.label}
          href={r.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Síguenos en ${r.label}`}
          title={r.label}
          className="flex items-center justify-center transition-transform duration-200 ease-out hover:scale-110"
        >
          <Image
            src={r.src}
            alt={r.label}
            width={29}
            height={29}
            unoptimized
            className="h-[29px] w-[29px] object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
          />
        </a>
      ))}
    </div>
  );
}
