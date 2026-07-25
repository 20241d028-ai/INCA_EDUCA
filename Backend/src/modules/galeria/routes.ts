import { Router } from "express";
import multer from "multer";
import {
  postSubirGaleria,
  getGaleria,
  getGaleriaPorId,
  deleteGaleriaPorId,
} from "./controller";
import { requiereAuth } from "../../middleware/auth";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
});

const router = Router();

router.get("/", getGaleria);
router.get("/:id", getGaleriaPorId);

router.post("/", requiereAuth, upload.single("archivo"), postSubirGaleria);
router.delete("/:id", requiereAuth, deleteGaleriaPorId);

export default router;
