import { Request, Response } from "express";
import { autenticarAdmin } from "./service";

export async function postLogin(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email y contraseña son obligatorios" });
  }

  const resultado = await autenticarAdmin(email, password);
  if (!resultado) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  res.json(resultado);
}