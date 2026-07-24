import { Router } from "express";
import { getCarreras, getCarreraPorSlug } from "./controller";

const router = Router();

router.get("/", getCarreras);
router.get("/:slug", getCarreraPorSlug);

export default router;