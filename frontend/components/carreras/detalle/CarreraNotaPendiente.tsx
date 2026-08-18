// Aviso discreto para cuando el contenido disponible de una carrera no
// cubre el 100% de lo que indica su nombre oficial (ver notaPendiente en
// lib/carrerasContenido.ts). Solo se renderiza si la carrera define el texto.
export default function CarreraNotaPendiente({ texto }: { texto: string }) {
  return (
    <div className="bg-[var(--color-naranja)]/10 border-y border-[var(--color-naranja)]/25">
      <p className="max-w-6xl mx-auto px-6 py-3 text-sm text-[var(--color-tinta)]/80 text-center leading-relaxed">
        <span className="font-bold text-[var(--color-naranja)]">Nota: </span>
        {texto}
      </p>
    </div>
  );
}
