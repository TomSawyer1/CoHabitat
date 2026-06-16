"use server";

import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/session";
import { subDays, startOfDay, startOfWeek, startOfMonth } from "date-fns";

export async function getDashboardStats() {
  await requireSession();

  const now = new Date();
  const dayStart = startOfDay(now);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);
  const thirtyDaysAgo = subDays(now, 30);

  const [
    locataireCount, guardianCount,
    locSuspended, guardSuspended,
    locBanned, guardBanned,
    newTodayLoc, newTodayGuard,
    newWeekLoc, newWeekGuard,
    newMonthLoc, newMonthGuard,
    incidentCount, incidentsByStatus, registrationsRaw,
  ] = await Promise.all([
    prisma.locataire.count(),
    prisma.guardian.count(),
    prisma.locataire.count({ where: { status: "suspended" } }),
    prisma.guardian.count({ where: { status: "suspended" } }),
    prisma.locataire.count({ where: { status: "banned" } }),
    prisma.guardian.count({ where: { status: "banned" } }),
    prisma.locataire.count({ where: { created_at: { gte: dayStart } } }),
    prisma.guardian.count({ where: { created_at: { gte: dayStart } } }),
    prisma.locataire.count({ where: { created_at: { gte: weekStart } } }),
    prisma.guardian.count({ where: { created_at: { gte: weekStart } } }),
    prisma.locataire.count({ where: { created_at: { gte: monthStart } } }),
    prisma.guardian.count({ where: { created_at: { gte: monthStart } } }),
    prisma.incident.count(),
    prisma.incident.groupBy({ by: ["status"], _count: { id: true } }),
    Promise.all([
      prisma.locataire.findMany({ where: { created_at: { gte: thirtyDaysAgo } }, select: { created_at: true } }),
      prisma.guardian.findMany({ where: { created_at: { gte: thirtyDaysAgo } }, select: { created_at: true } }),
    ]),
  ]);

  const [locRegs, guardRegs] = registrationsRaw;
  const regMap = new Map<string, number>();
  for (let i = 0; i < 30; i++) {
    regMap.set(subDays(now, 29 - i).toISOString().slice(0, 10), 0);
  }
  for (const r of [...locRegs, ...guardRegs]) {
    const key = r.created_at.toISOString().slice(0, 10);
    if (regMap.has(key)) regMap.set(key, (regMap.get(key) ?? 0) + 1);
  }

  return {
    totalUsers: locataireCount + guardianCount,
    locataireCount,
    guardianCount,
    activeUsers: locataireCount + guardianCount - (locSuspended + guardSuspended + locBanned + guardBanned),
    suspended: locSuspended + guardSuspended,
    banned: locBanned + guardBanned,
    newToday: newTodayLoc + newTodayGuard,
    newWeek: newWeekLoc + newWeekGuard,
    newMonth: newMonthLoc + newMonthGuard,
    incidentCount,
    incidentsByStatus: incidentsByStatus.map((s) => ({ status: s.status, count: s._count.id })),
    registrationTrend: Array.from(regMap.entries()).map(([date, count]) => ({ date, count })),
  };
}
