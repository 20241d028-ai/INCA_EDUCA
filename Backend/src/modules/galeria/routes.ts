import { Router } from "express";
import multer from "multer";
import {
  postSubirGaleria,
  getGaleria,
  getGaleriaAdmin,
  getGaleriaPorId,
  patchGaleriaPorId,
  deleteGaleriaPorId,
} from "./controller";
import { requiereAuth } from "../../middleware/auth";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
});

const router = Router();

router.get("/", getGaleria);
// Debe ir antes de "/:id" para no ser interpretada como un id.
router.get("/admin/todos", requiereAuth, getGaleriaAdmin);
router.get("/:id", getGaleriaPorId);

router.post("/", requiereAuth, upload.single("archivo"), postSubirGaleria);
router.patch("/:id", requiereAuth, patchGaleriaPorId);
router.delete("/:id", requiereAuth, deleteGaleriaPorId);

export default router;
