"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import {
  createSession,
  destroySession,
  getRequestIp,
  setSessionCookie,
} from "@/lib/auth/session";
import { verifyPassword } from "@/lib/auth/password";
import { logAudit } from "@/lib/audit";

const loginSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(1),
});

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

async function recordAttempt(email: string, success: boolean): Promise<void> {
  try {
    await prisma.loginAttempt.create({
      data: { email, ip_address: await getRequestIp(), success },
    });
  } catch (error) {
    console.error("LoginAttempt log failure:", error);
  }
}

export async function loginAction(formData: FormData): Promise<{ error?: string }> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "Identifiants invalides." };

  const { email, password } = parsed.data;
  const staff = await prisma.staffAccount.findUnique({ where: { email } });

  if (!staff || !staff.is_active) {
    await recordAttempt(email, false);
    return { error: "Identifiants invalides." };
  }

  // Verrouillage temporaire après trop d'échecs (anti brute-force).
  if (staff.locked_until && staff.locked_until > new Date()) {
    await recordAttempt(email, false);
    return { error: "Compte temporairement verrouillé. Réessayez plus tard." };
  }

  const valid = await verifyPassword(staff.password_hash, password);
  if (!valid) {
    const failed = staff.failed_login_count + 1;
    const lock = failed >= MAX_FAILED_ATTEMPTS;
    await prisma.staffAccount.update({
      where: { id: staff.id },
      data: {
        failed_login_count: lock ? 0 : failed,
        locked_until: lock ? new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000) : null,
      },
    });
    await recordAttempt(email, false);
    return {
      error: lock
        ? `Trop de tentatives. Compte verrouillé ${LOCKOUT_MINUTES} minutes.`
        : "Identifiants invalides.",
    };
  }

  await prisma.staffAccount.update({
    where: { id: staff.id },
    data: { failed_login_count: 0, locked_until: null },
  });
  await recordAttempt(email, true);

  const { token } = await createSession(staff.id);
  await setSessionCookie(token);
  await logAudit(
    { staff: { id: staff.id, email: staff.email, nom: staff.nom, prenom: staff.prenom, role: staff.role, is_active: staff.is_active } },
    "login",
    "staff_account",
    staff.id,
  );
  redirect("/");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/login");
}
