// Datos institucionales de contacto de INCA EDUCA.
// Centralizados aquí para reutilizarse en toda la sección /contacto (y en
// cualquier otro lugar del sitio que los necesite) sin duplicar información.
//
// Dirección, teléfono y correo son los mismos datos reales ya usados en
// components/nosotros/ContactoSection.tsx y components/carreras/FaqSection.tsx.

export const DIRECCION = "Prol. Av. La Cultura, 6.º paradero San Sebastián, Cusco";
export const CIUDAD = "Cusco, Perú";
export const TELEFONO = "(084) 275994";
export const TELEFONO_TEL_HREF = "tel:+51084275994";
export const CORREO = "info@incaeduca.edu.pe";

// TODO(INCA EDUCA): reemplazar por el número real de WhatsApp institucional,
// en formato internacional sin espacios ni símbolos (ej. "51984123456").
// Mientras este valor sea el de ejemplo, los botones de WhatsApp de la
// sección de Contacto quedan funcionales pero apuntan a un número ficticio.
export const WHATSAPP_NUMERO = "51900000000"; // ⚠️ PENDIENTE: número real de INCA EDUCA
export const WHATSAPP_MENSAJE_INICIAL =
  "Hola, quisiera obtener información sobre las carreras de INCA EDUCA.";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(
  WHATSAPP_MENSAJE_INICIAL
)}`;

// TODO(INCA EDUCA): reemplazar por el enlace real de Google Maps / coordenadas
// reales del local cuando se confirmen con dirección.
export const MAPA_EMBED_URL =
  "https://www.google.com/maps?q=" + encodeURIComponent(DIRECCION) + "&output=embed";
export const MAPA_COMO_LLEGAR_URL =
  "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(DIRECCION);

export interface RangoHorario {
  dias: string;
  horas: string;
}

export const HORARIO_ATENCION: RangoHorario[] = [
  { dias: "Lunes a viernes", horas: "08:00 AM – 05:00 PM" },
  { dias: "Sábados", horas: "09:00 AM – 01:00 PM" },
];

/**
 * Determina si INCA EDUCA está en horario de atención en este momento,
 * según HORARIO_ATENCION. Pensado para uso en cliente (usa la hora local
 * del navegador). Si el horario cambia, solo hay que actualizar
 * HORARIO_ATENCION arriba.
 */
export function estaEnHorarioDeAtencion(fecha: Date = new Date()): boolean {
  const dia = fecha.getDay(); // 0 = domingo, 1 = lunes, ... 6 = sábado
  const minutos = fecha.getHours() * 60 + fecha.getMinutes();

  const LUNES_A_VIERNES = { inicio: 8 * 60, fin: 17 * 60 };
  const SABADO = { inicio: 9 * 60, fin: 13 * 60 };

  if (dia >= 1 && dia <= 5) {
    return minutos >= LUNES_A_VIERNES.inicio && minutos < LUNES_A_VIERNES.fin;
  }
  if (dia === 6) {
    return minutos >= SABADO.inicio && minutos < SABADO.fin;
  }
  return false;
}

export type MotivoConsulta =
  | "Información sobre carreras"
  | "Admisión"
  | "Matrícula"
  | "Requisitos"
  | "Información general"
  | "Otro";

export const MOTIVOS_CONSULTA: MotivoConsulta[] = [
  "Información sobre carreras",
  "Admisión",
  "Matrícula",
  "Requisitos",
  "Información general",
  "Otro",
];
