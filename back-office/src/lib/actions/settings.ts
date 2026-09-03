"use server";

import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/session";
import { hashPassword, isCompromisedPassword, passwordSchema, verifyPassword } from "@/lib/auth/password";
import { logAudit } from "@/lib/audit";
import { z } from "zod";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: passwordSchema,
});

export async function changeOwnPassword(data: z.infer<typeof changePasswordSchema>) {
  const session = await requireSession();
  const parsed = changePasswordSchema.parse(data);

  if (isCompromisedPassword(parsed.newPassword)) {
    return { error: "Ce mot de passe est trop courant." };
  }

  const staff = await prisma.staffAccount.findUniqueOrThrow({ where: { id: session.staff.id } });
  const valid = await verifyPassword(staff.password_hash, parsed.currentPassword);
  if (!valid) return { error: "Mot de passe actuel incorrect." };

  await prisma.staffAccount.update({
    where: { id: staff.id },
    data: { password_hash: await hashPassword(parsed.newPassword), password_changed_at: new Date() },
  });

  await logAudit(session, "staff.change_own_password", "staff_account", staff.id);
  return { success: true };
}

export async function getOwnProfile() {
  const session = await requireSession();
  return prisma.staffAccount.findUniqueOrThrow({
    where: { id: session.staff.id },
    select: { id: true, email: true, nom: true, prenom: true, last_login_at: true, created_at: true },
  });
}
