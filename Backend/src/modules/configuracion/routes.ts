import { Router } from "express";
import { getConfiguracion, patchConfiguracion } from "./controller";
import { requiereAuth } from "../../middleware/auth";

const router = Router();

router.get("/", getConfiguracion);
router.patch("/", requiereAuth, patchConfiguracion);

export default router;
