import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import carrerasRoutes from "./modules/carreras/routes";
import postulantesRoutes from "./modules/postulantes/routes";
import authRoutes from "./modules/auth/routes";
import chatRoutes from "./modules/chat/routes";
import webhooksRoutes from "./modules/webhooks/routes";
import whatsappRoutes from "./modules/whatsapp/routes";
import galeriaRoutes from "./modules/galeria/routes";


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
app.use("/api/galeria", galeriaRoutes);

// Red de seguridad: si cualquier ruta lanza un error no capturado, responder
// siempre en JSON (nunca la página HTML de error por defecto de Express),
// para que el frontend pueda leer el mensaje en vez de fallar al parsear.
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Error no manejado:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});