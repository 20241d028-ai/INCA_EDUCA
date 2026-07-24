import { Router } from "express";
import {
  postCrearPostulante,
  getPostulantes,
  getPostulantePorId,
  patchEstadoPostulante,
} from "./controller";

const router = Router();

// Público — usado por el formulario web y por el chatbot (RF02, RF24)
router.post("/", postCrearPostulante);

// Admin — se protegerán con JWT cuando construyamos el módulo auth (RF13)
router.get("/", getPostulantes);
router.get("/:id", getPostulantePorId);
router.patch("/:id/estado", patchEstadoPostulante);

export default router;