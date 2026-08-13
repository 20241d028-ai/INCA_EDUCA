import { Router } from "express";
import { postMensajeWhatsapp } from "./controller";

const router = Router();

router.post("/mensaje", postMensajeWhatsapp);

export default router;