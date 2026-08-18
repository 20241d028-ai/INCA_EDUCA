import type { Metadata } from "next";
import ContactoHero from "@/components/contacto/ContactoHero";
import ContactoTarjetas from "@/components/contacto/ContactoTarjetas";
import ContactoWhatsApp from "@/components/contacto/ContactoWhatsApp";
import ContactoFormulario from "@/components/contacto/ContactoFormulario";
import ContactoUbicacion from "@/components/contacto/ContactoUbicacion";
import ContactoFaq from "@/components/contacto/ContactoFaq";
import ContactoCtaFinal from "@/components/contacto/ContactoCtaFinal";

export const metadata: Metadata = {
  title: "Contacto — INCA EDUCA",
  description:
    "Comunícate con INCA EDUCA por WhatsApp, teléfono o correo. Resuelve tus dudas sobre carreras, admisión y matrícula.",
};

export default function ContactoPage() {
  return (
    <main>
      <ContactoHero />
      <ContactoTarjetas />
      <ContactoWhatsApp />
      <ContactoFormulario />
      <ContactoUbicacion />
      <ContactoFaq />
      <ContactoCtaFinal />
    </main>
  );
}
