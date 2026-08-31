import { Router } from "express";
import {
  postCrearContacto,
  getContactos,
  patchEstadoContacto,
  getPendientesRecordatorioContacto,
} from "./controller";
import { requiereAuth } from "../../middleware/auth";

const router = Router();

// Público: cualquiera puede enviar el formulario de /contacto
router.post("/", postCrearContacto);

// Llamado por n8n (protegido con x-webhook-secret, no con sesión de admin)
router.get("/pendientes-recordatorio", getPendientesRecordatorioContacto);

// Protegido: solo el panel admin puede leer y actualizar los mensajes
router.get("/", requiereAuth, getContactos);
router.patch("/:id/estado", requiereAuth, patchEstadoContacto);

export default router;