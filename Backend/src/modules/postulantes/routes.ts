import { Router } from "express";
import {
  postCrearPostulante,
  getPostulantes,
  getPostulantePorId,
  patchEstadoPostulante,
  getPendientesRecordatorio,
} from "./controller";
import { requiereAuth } from "../../middleware/auth";

const router = Router();

router.post("/", postCrearPostulante);

router.get("/pendientes-recordatorio", getPendientesRecordatorio);

router.get("/", requiereAuth, getPostulantes);
router.get("/:id", requiereAuth, getPostulantePorId);
router.patch("/:id/estado", requiereAuth, patchEstadoPostulante);

export default router;