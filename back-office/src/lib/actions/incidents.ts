"use server";

import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/session";
import { logAudit } from "@/lib/audit";
import { z } from "zod";

// Statuts alignés sur le CHECK de la table `incidents` côté Backend Express.
const incidentStatusSchema = z.enum(["nouveau", "en_cours", "resolu", "ferme"]);

const incidentFilterSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  status: z.string().optional(),
  batimentId: z.coerce.number().int().optional(),
  search: z.string().optional(),
});

export async function getIncidents(params: z.input<typeof incidentFilterSchema>) {
  await requireSession();
  const { page, pageSize, status, batimentId, search } = incidentFilterSchema.parse(params);
  const skip = (page - 1) * pageSize;

  const where = {
    ...(status ? { status } : {}),
    ...(batimentId ? { idBatiment: batimentId } : {}),
    ...(search ? { OR: [{ title: { contains: search } }, { description: { contains: search } }, { type: { contains: search } }] } : {}),
  };

  const [data, total] = await Promise.all([
    prisma.incident.findMany({
      where,
      include: {
        batiment: { select: { nom: true } },
        locataire: { select: { nom: true, prenom: true } },
        assignedGuardian: { select: { nom: true, prenom: true } },
      },
      orderBy: { created_at: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.incident.count({ where }),
  ]);

  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function updateIncidentStatus(id: number, status: string, comment?: string) {
  const session = await requireSession();
  const parsedStatus = incidentStatusSchema.safeParse(status);
  if (!parsedStatus.success) return { error: "Statut d'incident invalide." };

  const incident = await prisma.incident.findUnique({ where: { id }, select: { status: true } });
  if (!incident) return { error: "Incident introuvable." };

  // L'app mobile affiche l'historique des transitions : on journalise dans
  // incident_history comme le fait le Backend Express, sinon les interventions
  // du back-office y sont invisibles.
  await prisma.$transaction([
    prisma.incident.update({
      where: { id },
      data: {
        status: parsedStatus.data,
        ...(parsedStatus.data === "resolu" ? { resolved_at: new Date(), resolution_comment: comment ?? null } : {}),
      },
    }),
    prisma.incidentHistory.create({
      data: {
        incident_id: id,
        action: "Statut modifié (back-office)",
        old_status: incident.status,
        new_status: parsedStatus.data,
        comment: comment ?? null,
        user_id: session.staff.id,
        user_role: "staff",
      },
    }),
  ]);

  await logAudit(session, "incident.set_status", "incident", id, { from: incident.status, to: parsedStatus.data });
  return { success: true };
}

export async function assignIncident(id: number, guardianId: number | null) {
  const session = await requireSession();

  const incident = await prisma.incident.findUnique({ where: { id }, select: { status: true } });
  if (!incident) return { error: "Incident introuvable." };

  const newStatus = guardianId ? "en_cours" : "nouveau";
  await prisma.$transaction([
    prisma.incident.update({ where: { id }, data: { assigned_guardian_id: guardianId, status: newStatus } }),
    prisma.incidentHistory.create({
      data: {
        incident_id: id,
        action: guardianId ? "Gardien assigné (back-office)" : "Assignation retirée (back-office)",
        old_status: incident.status,
        new_status: newStatus,
        user_id: session.staff.id,
        user_role: "staff",
      },
    }),
  ]);

  await logAudit(session, "incident.assign", "incident", id, { guardianId });
  return { success: true };
}
