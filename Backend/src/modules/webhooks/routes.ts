import { Router } from "express";
import { postSeguimiento } from "./controller";
import { requiereWebhookSecret } from "../../middleware/webhookAuth";

const router = Router();

router.post("/n8n/seguimiento", requiereWebhookSecret, postSeguimiento);

export default router;