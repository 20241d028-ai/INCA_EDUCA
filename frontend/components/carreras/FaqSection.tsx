"use client";

import { useState } from "react";
import { IconChevronDown } from "@/components/ui/Icons";

const PREGUNTAS = [
  {
    pregunta: "¿Cuánto dura cada carrera?",
    respuesta:
      "La duración varía según la carrera: la mayoría se completa en 1 año, y Cosmetología y Barbería dura 1 año y 4 meses. Puedes revisar la duración exacta en la ficha de cada carrera.",
  },
  {
    pregunta: "¿Qué requisitos necesito para postular?",
    respuesta:
      "Completa el formulario de admisión con tus datos y DNI. Un asesor te contactará para confirmar los requisitos específicos de la carrera que elijas.",
  },
  {
    pregunta: "¿Dónde se encuentran las instalaciones?",
    respuesta: "Prol. Av. la Cultura, 6º paradero San Sebastián, Cusco.",
  },
  {
    pregunta: "¿Las clases son presenciales?",
    respuesta:
      "La mayoría de nuestras carreras se dictan de forma presencial en nuestras instalaciones en Cusco. Escríbenos para confirmar la modalidad de la carrera que te interesa.",
  },
  {
    pregunta: "¿Cómo puedo realizar mi matrícula?",
    respuesta:
      "Completa el formulario de admisión desde la web o a través de nuestro chat. Un asesor de INCA EDUCA se pondrá en contacto contigo para finalizar tu matrícula.",
  },
  {
    pregunta: "¿Cómo puedo obtener más información sobre una carrera?",
    respuesta:
      "Ingresa a la sección Carreras y revisa el detalle de cada una, o escríbenos por el chat y un asesor te ayudará con lo que necesites.",
  },
];

export default function FaqSection() {
  const [abierta, setAbierta] = useState<number | null>(0);

  return (
    <section className="bg-[var(--color-fondo)] py-20">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="font-titulo text-3xl md:text-4xl font-bold text-[var(--color-verde-oscuro)] text-center">
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
                className="rounded-2xl border border-[var(--color-linea)] bg-white overflow-hidden"
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
