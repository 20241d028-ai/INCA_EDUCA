import { Router } from "express";
import { postLogin } from "./controller";

const router = Router();

router.post("/login", postLogin);

export default router;