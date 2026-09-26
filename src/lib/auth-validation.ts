import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .email("Introduz um e-mail válido.")
  .max(255, "O e-mail é demasiado longo.");
export const passwordSchema = z
  .string()
  .min(8, "A palavra-passe deve ter pelo menos 8 caracteres.")
  .max(128, "A palavra-passe é demasiado longa.")
  .regex(/[A-Z]/, "Inclui pelo menos uma letra maiúscula.")
  .regex(/[a-z]/, "Inclui pelo menos uma letra minúscula.")
  .regex(/[0-9]/, "Inclui pelo menos um número.");
export const playerNameSchema = z
  .string()
  .trim()
  .min(3, "O nome deve ter pelo menos 3 caracteres.")
  .max(24, "O nome não pode ter mais de 24 caracteres.")
  .regex(/^[\p{L}\p{N}_ ]+$/u, "Usa apenas letras, números, espaços ou _.");
export const ageSchema = z.coerce
  .number({ message: "Introduz a tua idade." })
  .int("A idade deve ser um número inteiro.")
  .min(13, "Tens de ter pelo menos 13 anos.")
  .max(110, "Introduz uma idade válida.");
export const countrySchema = z
  .string()
  .trim()
  .min(2, "Indica o teu país.")
  .max(56, "Nome de país demasiado longo.");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Introduz a palavra-passe."),
});
export const accountStepSchema = z.object({ email: emailSchema, password: passwordSchema });
export const profileStepSchema = z.object({
  playerName: playerNameSchema,
  age: ageSchema,
  country: countrySchema,
});
export const registerSchema = z.object({
  playerName: playerNameSchema,
  email: emailSchema,
  password: passwordSchema,
  age: ageSchema,
  country: countrySchema,
});
