import { Router } from "express";
import { getCarreras, getCarreraPorSlug, patchCarreraPorId } from "./controller";
import { requiereAuth } from "../../middleware/auth";

const router = Router();

router.get("/", getCarreras);
router.get("/:slug", getCarreraPorSlug);

// Administración: requiere estar logueado como admin. Va después de las
// rutas GET por claridad, pero al ser PATCH con un id (no un slug) no
// choca con "/:slug".
router.patch("/:id", requiereAuth, patchCarreraPorId);

export default router;
