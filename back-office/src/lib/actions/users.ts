"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireRole, requireSession, type SessionData } from "@/lib/auth/session";
import { hashAppUserPassword, passwordSchema } from "@/lib/auth/password";
import { logAudit } from "@/lib/audit";
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

export type ActionResult = { success: true } | { error: string };

// La gestion des comptes utilisateurs est réservée aux admins ;
// les opérateurs gardent la lecture seule.
async function requireAdmin(): Promise<{ session: SessionData } | { error: string }> {
  try {
    return { session: await requireRole("admin") };
  } catch {
    return { error: "Accès refusé : rôle administrateur requis." };
  }
}

const userFilterSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  status: z.enum(["all", "active", "suspended", "banned"]).default("all"),
  type: z.enum(["all", "locataire", "guardian"]).default("all"),
  sortBy: z.enum(["created_at", "nom", "email"]).default("created_at"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
});

const USER_LIST_SELECT = {
  id: true,
  email: true,
  nom: true,
  prenom: true,
  telephone: true,
  status: true,
  created_at: true,
  batiment: { select: { nom: true } },
} as const;

export async function getAppUsers(params: z.input<typeof userFilterSchema>) {
  await requireSession();

  const filters = userFilterSchema.parse(params);
  const { page, pageSize, search, status, type, sortBy, sortDir } = filters;
  const skip = (page - 1) * pageSize;

  const searchFilter = search
    ? { OR: [{ email: { contains: search } }, { nom: { contains: search } }, { prenom: { contains: search } }] }
    : {};
  const statusFilter = status !== "all" ? { status } : {};
  const where = { ...searchFilter, ...statusFilter };

  // Cas mono-type : la pagination est poussée en SQL.
  if (type !== "all") {
    const query = { where, select: USER_LIST_SELECT, orderBy: { [sortBy]: sortDir }, skip, take: pageSize };
    const [rows, total] =
      type === "locataire"
        ? await Promise.all([prisma.locataire.findMany(query), prisma.locataire.count({ where })])
        : await Promise.all([prisma.guardian.findMany(query), prisma.guardian.count({ where })]);
    const data: AppUserRow[] = rows.map((u) => ({
      id: u.id, type, email: u.email, nom: u.nom, prenom: u.prenom,
      telephone: u.telephone, status: u.status, batimentNom: u.batiment?.nom ?? null, created_at: u.created_at,
    }));
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  // Cas "tous types" : fusion de deux tables → tri/pagination en mémoire,
  // mais on ne sélectionne que les colonnes affichées.
  const [locataires, guardians, locCount, guardCount] = await Promise.all([
    prisma.locataire.findMany({ where, select: USER_LIST_SELECT, orderBy: { [sortBy]: sortDir } }),
    prisma.guardian.findMany({ where, select: USER_LIST_SELECT, orderBy: { [sortBy]: sortDir } }),
    prisma.locataire.count({ where }),
    prisma.guardian.count({ where }),
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

export async function updateAppUser(type: AppUserType, id: number, data: z.infer<typeof updateUserSchema>): Promise<ActionResult> {
  const guard = await requireAdmin();
  if ("error" in guard) return guard;
  const parsed = updateUserSchema.parse(data);

  const payload = { nom: parsed.nom, prenom: parsed.prenom, telephone: parsed.telephone ?? null, email: parsed.email };
  try {
    if (type === "locataire") {
      await prisma.locataire.update({ where: { id }, data: payload });
    } else {
      await prisma.guardian.update({ where: { id }, data: payload });
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "Cet email est déjà utilisé par un autre compte." };
    }
    throw error;
  }

  await logAudit(guard.session, "user.update", type, id, { email: parsed.email });
  return { success: true };
}

export async function setAppUserStatus(type: AppUserType, id: number, status: "active" | "suspended" | "banned"): Promise<ActionResult> {
  const guard = await requireAdmin();
  if ("error" in guard) return guard;

  if (type === "locataire") {
    await prisma.locataire.update({ where: { id }, data: { status } });
  } else {
    await prisma.guardian.update({ where: { id }, data: { status } });
  }

  await logAudit(guard.session, "user.set_status", type, id, { status });
  return { success: true };
}

export async function deleteAppUser(type: AppUserType, id: number): Promise<ActionResult> {
  const guard = await requireAdmin();
  if ("error" in guard) return guard;

  // Suppression en transaction avec cascade explicite : SQLite (via Prisma)
  // applique les FK, un delete brut échouerait dès qu'il existe des incidents liés.
  if (type === "locataire") {
    await prisma.$transaction([
      prisma.incidentComment.deleteMany({ where: { incident: { idUtilisateur: id } } }),
      prisma.incidentHistory.deleteMany({ where: { incident: { idUtilisateur: id } } }),
      prisma.incident.deleteMany({ where: { idUtilisateur: id } }),
      prisma.incidentComment.deleteMany({ where: { user_id: id, user_role: "locataire" } }),
      prisma.locataire.delete({ where: { id } }),
    ]);
  } else {
    await prisma.$transaction([
      prisma.incident.updateMany({ where: { assigned_guardian_id: id }, data: { assigned_guardian_id: null } }),
      prisma.batiment.updateMany({ where: { id_guardians: id }, data: { id_guardians: null } }),
      prisma.incidentComment.deleteMany({ where: { user_id: id, user_role: "guardian" } }),
      prisma.guardian.delete({ where: { id } }),
    ]);
  }

  await logAudit(guard.session, "user.delete", type, id);
  return { success: true };
}

export async function resetAppUserPassword(type: AppUserType, id: number, newPassword: string): Promise<ActionResult> {
  const guard = await requireAdmin();
  if ("error" in guard) return guard;

  const parsed = passwordSchema.safeParse(newPassword);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Mot de passe invalide" };

  const hash = await hashAppUserPassword(parsed.data);
  if (type === "locataire") {
    await prisma.locataire.update({ where: { id }, data: { password: hash } });
  } else {
    await prisma.guardian.update({ where: { id }, data: { password: hash } });
  }

  await logAudit(guard.session, "user.reset_password", type, id);
  return { success: true };
}

// Neutralise les injections de formule (Excel/LibreOffice interprètent les
// cellules commençant par = + - @) puis échappe les guillemets CSV.
function csvCell(value: unknown): string {
  let str = String(value ?? "");
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

export async function exportAppUsersCsv(): Promise<string> {
  const guard = await requireAdmin();
  if ("error" in guard) throw new Error(guard.error);

  const [locataires, guardians] = await Promise.all([
    prisma.locataire.findMany({ select: USER_LIST_SELECT }),
    prisma.guardian.findMany({ select: USER_LIST_SELECT }),
  ]);

  const rows = [
    ["type", "id", "email", "nom", "prenom", "telephone", "statut", "batiment", "inscription"],
    ...locataires.map((u) => ["locataire", u.id, u.email, u.nom, u.prenom, u.telephone ?? "", u.status, u.batiment?.nom ?? "", u.created_at.toISOString()]),
    ...guardians.map((u) => ["guardian", u.id, u.email, u.nom, u.prenom, u.telephone ?? "", u.status, u.batiment?.nom ?? "", u.created_at.toISOString()]),
  ];

  await logAudit(guard.session, "user.export_csv", "app_users", undefined, { count: rows.length - 1 });
  return rows.map((r) => r.map(csvCell).join(",")).join("\n");
}

export async function bulkSetAppUserStatus(ids: { type: AppUserType; id: number }[], status: "active" | "suspended" | "banned"): Promise<ActionResult & { count?: number }> {
  const guard = await requireAdmin();
  if ("error" in guard) return guard;

  const locataireIds = ids.filter((i) => i.type === "locataire").map((i) => i.id);
  const guardianIds = ids.filter((i) => i.type === "guardian").map((i) => i.id);

  await prisma.$transaction([
    prisma.locataire.updateMany({ where: { id: { in: locataireIds } }, data: { status } }),
    prisma.guardian.updateMany({ where: { id: { in: guardianIds } }, data: { status } }),
  ]);

  await logAudit(guard.session, "user.bulk_set_status", "app_users", undefined, { status, ids });
  return { success: true, count: ids.length };
}
