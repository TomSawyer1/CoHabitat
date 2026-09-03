"use server";

import { prisma } from "@/lib/db";
import { requireRole, requireSession, type SessionData } from "@/lib/auth/session";
import { logAudit } from "@/lib/audit";
import { z } from "zod";

const batimentSchema = z.object({
  nom: z.string().min(1).max(100),
  rue: z.string().min(1).max(200),
  nombre_etage: z.coerce.number().int().min(0).nullable().optional(),
  nombre_appartement: z.coerce.number().int().min(0).nullable().optional(),
  annee_construction: z.coerce.number().int().min(1800).max(2100).nullable().optional(),
  id_guardians: z.coerce.number().int().nullable().optional(),
  equipements: z.string().optional().nullable(),
  reglement: z.string().optional().nullable(),
});

async function requireAdmin(): Promise<{ session: SessionData } | { error: string }> {
  try {
    return { session: await requireRole("admin") };
  } catch {
    return { error: "Accès refusé : rôle administrateur requis." };
  }
}

export async function getBatiments() {
  await requireSession();
  return prisma.batiment.findMany({
    include: { guardian: { select: { nom: true, prenom: true } }, _count: { select: { locataires: true, incidents: true } } },
    orderBy: { nom: "asc" },
  });
}

export async function getBatiment(id: number) {
  await requireSession();
  return prisma.batiment.findUnique({
    where: { id },
    include: { guardian: { select: { id: true, nom: true, prenom: true } } },
  });
}

export async function createBatiment(data: z.infer<typeof batimentSchema>) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard;
  const parsed = batimentSchema.parse(data);
  const created = await prisma.batiment.create({ data: parsed });
  await logAudit(guard.session, "batiment.create", "batiment", created.id, { nom: parsed.nom });
  return { success: true };
}

export async function updateBatiment(id: number, data: z.infer<typeof batimentSchema>) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard;
  const parsed = batimentSchema.parse(data);
  await prisma.batiment.update({ where: { id }, data: parsed });
  await logAudit(guard.session, "batiment.update", "batiment", id);
  return { success: true };
}

export async function deleteBatiment(id: number) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard;

  // Un bâtiment référencé (locataires, gardiens ou incidents) ne peut pas être
  // supprimé : les FK SQLite feraient échouer la requête avec une 500 illisible.
  const counts = await prisma.batiment.findUnique({
    where: { id },
    select: { _count: { select: { locataires: true, guardians: true, incidents: true } } },
  });
  if (!counts) return { error: "Bâtiment introuvable." };
  const { locataires, guardians, incidents } = counts._count;
  if (locataires > 0 || guardians > 0 || incidents > 0) {
    return {
      error: `Suppression impossible : ce bâtiment a encore ${locataires} locataire(s), ${guardians} gardien(s) et ${incidents} incident(s) rattachés.`,
    };
  }

  await prisma.batiment.delete({ where: { id } });
  await logAudit(guard.session, "batiment.delete", "batiment", id);
  return { success: true };
}

export async function getGuardianOptions() {
  await requireSession();
  return prisma.guardian.findMany({
    where: { status: "active" },
    select: { id: true, nom: true, prenom: true },
    orderBy: { nom: "asc" },
  });
}
