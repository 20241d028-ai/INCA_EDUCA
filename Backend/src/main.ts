import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import carrerasRoutes from "./modules/carreras/routes";
import postulantesRoutes from "./modules/postulantes/routes";
import authRoutes from "./modules/auth/routes";
import chatRoutes from "./modules/chat/routes";
import webhooksRoutes from "./modules/webhooks/routes";
import whatsappRoutes from "./modules/whatsapp/routes";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use("/api/postulantes", postulantesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/webhooks", webhooksRoutes);

app.use("/api/whatsapp", whatsappRoutes);

app.get("/", (_req, res) => {
  res.json({ mensaje: "API de INCA EDUCA funcionando correctamente" });
});

app.use("/api/carreras", carrerasRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});