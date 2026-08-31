import { Request, Response } from "express";
import {
  crearContacto,
  listarContactos,
  actualizarEstadoContacto,
  EstadoContacto,
} from "./service";

const CORREO_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CELULAR_REGEX = /^\d{9}$/;
const ESTADOS_VALIDOS: EstadoContacto[] = ["nuevo", "atendido"];

export async function postCrearContacto(req: Request, res: Response) {
  const { nombre, correo, telefono, motivo, mensaje } = req.body;

  if (!nombre || !correo || !telefono || !motivo || !mensaje) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }
  if (!CORREO_REGEX.test(String(correo).trim())) {
    return res.status(400).json({ error: "Ingresa un correo electrónico válido" });
  }
  if (!CELULAR_REGEX.test(String(telefono).trim())) {
    return res.status(400).json({ error: "El teléfono debe tener 9 dígitos" });
  }

  try {
    const contacto = await crearContacto({
      nombre: String(nombre).trim(),
      correo: String(correo).trim(),
      telefono: String(telefono).trim(),
      motivo: String(motivo).trim(),
      mensaje: String(mensaje).trim(),
    });

    // Igual que en postulantes/controller.ts: notifica a n8n si está
    // configurado, sin bloquear la respuesta al usuario si n8n falla.
    if (process.env.N8N_WEBHOOK_URL) {
      fetch(process.env.N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "contacto",
          contactoId: contacto.id,
          nombre: contacto.nombre,
          correo: contacto.correo,
          telefono: `51${contacto.telefono}`,
          motivo: contacto.motivo,
          mensaje: contacto.mensaje,
        }),
      }).catch((err) => {
        console.error("No se pudo notificar a n8n:", err);
      });
    }

    res.status(201).json(contacto);
  } catch (error) {
    console.error("Error al guardar el mensaje de contacto:", error);
    res.status(500).json({ error: "No se pudo enviar tu mensaje. Intenta nuevamente." });
  }
}

export async function getContactos(req: Request, res: Response) {
  const estado = req.query.estado as EstadoContacto | undefined;
  if (estado && !ESTADOS_VALIDOS.includes(estado)) {
    return res.status(400).json({ error: "Estado inválido" });
  }
  const contactos = await listarContactos(estado);
  res.json(contactos);
}

export async function patchEstadoContacto(req: Request<{ id: string }>, res: Response) {
  const { estado } = req.body;
  if (!ESTADOS_VALIDOS.includes(estado)) {
    return res.status(400).json({ error: "Estado inválido" });
  }
  const contacto = await actualizarEstadoContacto(req.params.id, estado);
  if (!contacto) {
    return res.status(404).json({ error: "Contacto no encontrado" });
  }
  res.json(contacto);
}
