import { Router } from "express";
import {
  getNotificaciones,
  getContadorNoLeidas,
  patchMarcarLeida,
  patchMarcarTodasLeidas,
} from "./controller";
import { requiereAuth } from "../../middleware/auth";

const router = Router();

router.get("/", requiereAuth, getNotificaciones);
router.get("/no-leidas", requiereAuth, getContadorNoLeidas);
router.patch("/leer-todas", requiereAuth, patchMarcarTodasLeidas);
router.patch("/:id/leido", requiereAuth, patchMarcarLeida);

export default router;
