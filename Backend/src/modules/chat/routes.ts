import { Router } from "express";
import { postMensaje, postEscalar, getConversaciones, getConversacionPorId } from "./controller";
import { requiereAuth } from "../../middleware/auth";
import { uploadAudioMiddleware, postMensajeAudio } from "./controller";


const router = Router();

router.post("/mensaje", postMensaje);
router.post("/escalar", postEscalar);

router.get("/conversaciones", requiereAuth, getConversaciones);
router.get("/conversaciones/:id", requiereAuth, getConversacionPorId);
router.post("/mensaje-audio", uploadAudioMiddleware, postMensajeAudio);

export default router;