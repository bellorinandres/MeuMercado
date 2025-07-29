import { z } from "zod";

const passwordRules = z
  .string()
  .min(6, "La contraseña debe tener al menos 6 caracteres")
  .regex(/[a-z]/, "Debe tener una letra minúscula")
  .regex(/[A-Z]/, "Debe tener una letra mayúscula")
  .regex(/[0-9]/, "Debe tener un número")
  .regex(/[^a-zA-Z0-9]/, "Debe tener un carácter especial");

export const registerSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  email: z.string().email("Correo inválido"),
  password: passwordRules,
});

export const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "La contraseña es requerida"),
});
