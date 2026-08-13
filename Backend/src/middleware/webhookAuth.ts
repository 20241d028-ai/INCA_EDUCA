import { Request, Response, NextFunction } from "express";

const N8N_WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET as string;

export function requiereWebhookSecret(req: Request, res: Response, next: NextFunction) {
  const secretRecibido = req.headers["x-webhook-secret"];

  if (secretRecibido !== N8N_WEBHOOK_SECRET) {
    return res.status(401).json({ error: "Secreto de webhook inválido" });
  }

  next();
}