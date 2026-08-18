"use client";

import { useState } from "react";
import { IconChevronDown } from "@/components/ui/Icons";
import { TELEFONO, CORREO } from "@/lib/contacto";

const PREGUNTAS = [
  {
    pregunta: "¿Cómo puedo postular a INCA EDUCA?",
    respuesta:
      "Completa el formulario de admisión desde nuestra web (botón «Postula ahora») o escríbenos por WhatsApp. Un asesor de INCA EDUCA te contactará para continuar con tu inscripción.",
  },
  {
    pregunta: "¿Qué carreras están disponibles?",
    respuesta:
      "Ofrecemos carreras técnicas orientadas al turismo, la gastronomía y áreas administrativas. Revisa el detalle de cada una, con su duración y módulos, en la sección Carreras.",
  },
  {
    pregunta: "¿Cuáles son los requisitos de admisión?",
    respuesta:
      "Completa el formulario de admisión con tus datos y DNI. Un asesor te contactará para confirmar los requisitos específicos según la carrera y modalidad que elijas.",
  },
  {
    pregunta: "¿Dónde puedo realizar mi matrícula?",
    respuesta:
      "Puedes iniciar tu matrícula completando el formulario de admisión en la web o por WhatsApp, y también de forma presencial en nuestras instalaciones en Cusco.",
  },
  {
    pregunta: "¿Cómo puedo comunicarme con la institución?",
    respuesta: `Puedes escribirnos por WhatsApp, llamarnos al ${TELEFONO}, enviarnos un correo a ${CORREO} o completar el formulario de esta página.`,
  },
];

export default function ContactoFaq() {
  const [abierta, setAbierta] = useState<number | null>(0);

  return (
    <section className="bg-white py-20">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="font-titulo text-3xl md:text-4xl font-extrabold text-[var(--color-verde-oscuro)] text-center">
          Preguntas frecuentes
        </h2>
        <p className="mt-3 text-[var(--color-tinta)]/70 text-center">
          ¿Tienes dudas? Aquí respondemos las más comunes.
        </p>

        <div className="mt-10 flex flex-col gap-3">
          {PREGUNTAS.map((item, i) => {
            const estaAbierta = abierta === i;
            return (
              <div
                key={item.pregunta}
                className="rounded-2xl border border-[var(--color-linea)] bg-[var(--color-fondo)] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setAbierta(estaAbierta ? null : i)}
                  aria-expanded={estaAbierta}
                  className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 sm:px-6 sm:py-5"
                >
                  <span className="font-titulo font-bold text-[var(--color-tinta)]">
                    {item.pregunta}
                  </span>
                  <IconChevronDown
                    className={`w-5 h-5 flex-shrink-0 text-[var(--color-naranja)] transition-transform duration-300 ${
                      estaAbierta ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-all duration-300 ease-out ${
                    estaAbierta ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm text-[var(--color-tinta)]/70 leading-relaxed">
                      {item.respuesta}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
