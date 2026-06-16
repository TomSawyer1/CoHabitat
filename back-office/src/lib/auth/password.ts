import argon2 from "argon2";
import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(12, "Minimum 12 caractères")
  .max(128)
  .regex(/[a-z]/, "Au moins une minuscule")
  .regex(/[A-Z]/, "Au moins une majuscule")
  .regex(/[0-9]/, "Au moins un chiffre")
  .regex(/[^A-Za-z0-9]/, "Au moins un caractère spécial");

const COMPROMISED_PASSWORDS = new Set([
  "password123!",
  "Password123!",
  "Admin123456!",
  "SuperAdmin123!",
  "123456789012",
  "qwertyuiop12!",
]);

export function isCompromisedPassword(password: string): boolean {
  return COMPROMISED_PASSWORDS.has(password);
}

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}

/** Vérifie aussi les mots de passe bcrypt hérités (app mobile). */
export async function verifyAnyPassword(
  hash: string,
  password: string,
): Promise<boolean> {
  if (hash.startsWith("$argon2")) {
    return verifyPassword(hash, password);
  }
  const bcrypt = await import("bcryptjs");
  return bcrypt.compare(password, hash);
}

export async function hashAppUserPassword(password: string): Promise<string> {
  return hashPassword(password);
}
