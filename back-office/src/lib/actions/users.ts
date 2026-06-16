"use server";

import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/session";
import { hashAppUserPassword, passwordSchema } from "@/lib/auth/password";
import { z } from "zod";

export type AppUserType = "locataire" | "guardian";

export type AppUserRow = {
  id: number;
  type: AppUserType;
  email: string;
  nom: string;
  prenom: string;
  telephone: string | null;
  status: string;
  batimentNom: string | null;
  created_at: Date;
};

const userFilterSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  status: z.enum(["all", "active", "suspended", "banned"]).default("all"),
  type: z.enum(["all", "locataire", "guardian"]).default("all"),
  sortBy: z.enum(["created_at", "nom", "email"]).default("created_at"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
});

export async function getAppUsers(params: z.input<typeof userFilterSchema>) {
  await requireSession();

  const filters = userFilterSchema.parse(params);
  const { page, pageSize, search, status, type, sortBy, sortDir } = filters;
  const skip = (page - 1) * pageSize;

  const searchFilter = search
    ? { OR: [{ email: { contains: search } }, { nom: { contains: search } }, { prenom: { contains: search } }] }
    : {};
  const statusFilter = status !== "all" ? { status } : {};

  const [locataires, guardians, locCount, guardCount] = await Promise.all([
    type === "guardian" ? Promise.resolve([]) : prisma.locataire.findMany({
      where: { ...searchFilter, ...statusFilter },
      include: { batiment: { select: { nom: true } } },
      orderBy: { [sortBy]: sortDir },
    }),
    type === "locataire" ? Promise.resolve([]) : prisma.guardian.findMany({
      where: { ...searchFilter, ...statusFilter },
      include: { batiment: { select: { nom: true } } },
      orderBy: { [sortBy]: sortDir },
    }),
    type === "guardian" ? 0 : prisma.locataire.count({ where: { ...searchFilter, ...statusFilter } }),
    type === "locataire" ? 0 : prisma.guardian.count({ where: { ...searchFilter, ...statusFilter } }),
  ]);

  const combined: AppUserRow[] = [
    ...locataires.map((u) => ({ id: u.id, type: "locataire" as const, email: u.email, nom: u.nom, prenom: u.prenom, telephone: u.telephone, status: u.status, batimentNom: u.batiment?.nom ?? null, created_at: u.created_at })),
    ...guardians.map((u) => ({ id: u.id, type: "guardian" as const, email: u.email, nom: u.nom, prenom: u.prenom, telephone: u.telephone, status: u.status, batimentNom: u.batiment?.nom ?? null, created_at: u.created_at })),
  ];

  combined.sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    if (sortBy === "created_at") return (a.created_at.getTime() - b.created_at.getTime()) * dir;
    return String(a[sortBy]).toLowerCase().localeCompare(String(b[sortBy]).toLowerCase()) * dir;
  });

  const total = locCount + guardCount;
  return { data: combined.slice(skip, skip + pageSize), total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getAppUserDetail(type: AppUserType, id: number) {
  await requireSession();

  if (type === "locataire") {
    const user = await prisma.locataire.findUnique({
      where: { id },
      include: { batiment: true, incidents: { orderBy: { created_at: "desc" }, take: 20, include: { batiment: { select: { nom: true } } } } },
    });
    if (!user) return null;
    const { password: _, ...rest } = user;
    return { type: "locataire" as const, user: rest };
  }

  const user = await prisma.guardian.findUnique({
    where: { id },
    include: { batiment: true, assignedIncidents: { orderBy: { created_at: "desc" }, take: 20, include: { batiment: { select: { nom: true } } } } },
  });
  if (!user) return null;
  const { password: _, ...rest } = user;
  return { type: "guardian" as const, user: rest };
}

const updateUserSchema = z.object({
  nom: z.string().min(1).max(80),
  prenom: z.string().min(1).max(80),
  telephone: z.string().max(20).optional().nullable(),
  email: z.string().email(),
});

export async function updateAppUser(type: AppUserType, id: number, data: z.infer<typeof updateUserSchema>) {
  await requireSession();
  const parsed = updateUserSchema.parse(data);

  if (type === "locataire") {
    await prisma.locataire.update({ where: { id }, data: { nom: parsed.nom, prenom: parsed.prenom, telephone: parsed.telephone ?? null, email: parsed.email } });
  } else {
    await prisma.guardian.update({ where: { id }, data: { nom: parsed.nom, prenom: parsed.prenom, telephone: parsed.telephone ?? null, email: parsed.email } });
  }

  return { success: true };
}

export async function setAppUserStatus(type: AppUserType, id: number, status: "active" | "suspended" | "banned") {
  await requireSession();

  if (type === "locataire") {
    await prisma.locataire.update({ where: { id }, data: { status } });
  } else {
    await prisma.guardian.update({ where: { id }, data: { status } });
  }

  return { success: true };
}

export async function deleteAppUser(type: AppUserType, id: number) {
  await requireSession();

  if (type === "locataire") {
    await prisma.locataire.delete({ where: { id } });
  } else {
    await prisma.guardian.delete({ where: { id } });
  }

  return { success: true };
}

export async function resetAppUserPassword(type: AppUserType, id: number, newPassword: string) {
  await requireSession();

  const parsed = passwordSchema.safeParse(newPassword);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Mot de passe invalide" };

  const hash = await hashAppUserPassword(parsed.data);
  if (type === "locataire") {
    await prisma.locataire.update({ where: { id }, data: { password: hash } });
  } else {
    await prisma.guardian.update({ where: { id }, data: { password: hash } });
  }

  return { success: true };
}

export async function exportAppUsersCsv(): Promise<string> {
  await requireSession();

  const [locataires, guardians] = await Promise.all([
    prisma.locataire.findMany({ include: { batiment: { select: { nom: true } } } }),
    prisma.guardian.findMany({ include: { batiment: { select: { nom: true } } } }),
  ]);

  const rows = [
    ["type", "id", "email", "nom", "prenom", "telephone", "statut", "batiment", "inscription"],
    ...locataires.map((u) => ["locataire", u.id, u.email, u.nom, u.prenom, u.telephone ?? "", u.status, u.batiment?.nom ?? "", u.created_at.toISOString()]),
    ...guardians.map((u) => ["guardian", u.id, u.email, u.nom, u.prenom, u.telephone ?? "", u.status, u.batiment?.nom ?? "", u.created_at.toISOString()]),
  ];

  return rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
}

export async function bulkSetAppUserStatus(ids: { type: AppUserType; id: number }[], status: "active" | "suspended" | "banned") {
  await requireSession();
  for (const item of ids) {
    await setAppUserStatus(item.type, item.id, status);
  }
  return { success: true, count: ids.length };
}
