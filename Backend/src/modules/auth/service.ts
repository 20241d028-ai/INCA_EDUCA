import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../prisma";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = "8h";

export async function autenticarAdmin(email: string, password: string) {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) return null;

  const passwordValida = await bcrypt.compare(password, admin.passwordHash);
  if (!passwordValida) return null;

  const token = jwt.sign({ adminId: admin.id, email: admin.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return {
    token,
    admin: { id: admin.id, nombre: admin.nombre, email: admin.email },
  };
}