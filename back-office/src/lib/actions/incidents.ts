"use server";

import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/session";
import { z } from "zod";

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
  await requireSession();
  await prisma.incident.update({
    where: { id },
    data: {
      status,
      ...(status === "resolu" ? { resolved_at: new Date(), resolution_comment: comment ?? null } : {}),
    },
  });
  return { success: true };
}

export async function assignIncident(id: number, guardianId: number | null) {
  await requireSession();
  await prisma.incident.update({ where: { id }, data: { assigned_guardian_id: guardianId, status: guardianId ? "en_cours" : "nouveau" } });
  return { success: true };
}
