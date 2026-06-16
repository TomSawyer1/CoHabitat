"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createSession, destroySession, setSessionCookie } from "@/lib/auth/session";
import { verifyPassword } from "@/lib/auth/password";

const loginSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(1),
});

export async function loginAction(formData: FormData): Promise<{ error?: string }> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "Identifiants invalides." };

  const { email, password } = parsed.data;
  const staff = await prisma.staffAccount.findUnique({ where: { email } });
  if (!staff || !staff.is_active) return { error: "Identifiants invalides." };

  const valid = await verifyPassword(staff.password_hash, password);
  if (!valid) return { error: "Identifiants invalides." };

  const { token } = await createSession(staff.id);
  await setSessionCookie(token);
  redirect("/");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/login");
}
