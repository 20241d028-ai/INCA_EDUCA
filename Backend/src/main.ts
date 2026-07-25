import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import carrerasRoutes from "./modules/carreras/routes";
import notificacionesRoutes from "./modules/notificaciones/routes";
import galeriaRoutes from "./modules/galeria/routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ mensaje: "API de INCA EDUCA funcionando correctamente" });
});

app.use("/api/carreras", carrerasRoutes);
app.use("/api/notificaciones", notificacionesRoutes);
app.use("/api/galeria", galeriaRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});