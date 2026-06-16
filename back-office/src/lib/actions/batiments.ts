"use server";

import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/session";
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
  await requireSession();
  const parsed = batimentSchema.parse(data);
  await prisma.batiment.create({ data: parsed });
  return { success: true };
}

export async function updateBatiment(id: number, data: z.infer<typeof batimentSchema>) {
  await requireSession();
  const parsed = batimentSchema.parse(data);
  await prisma.batiment.update({ where: { id }, data: parsed });
  return { success: true };
}

export async function deleteBatiment(id: number) {
  await requireSession();
  await prisma.batiment.delete({ where: { id } });
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
