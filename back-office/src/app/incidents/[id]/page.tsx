import { notFound, redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { IncidentDetail } from "@/components/incidents/incident-detail";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { getGuardianOptions } from "@/lib/actions/batiments";

export default async function IncidentPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const incident = await prisma.incident.findUnique({
    where: { id: Number(id) },
    include: {
      batiment: true,
      locataire: { select: { id: true, nom: true, prenom: true, email: true, telephone: true } },
      assignedGuardian: { select: { id: true, nom: true, prenom: true } },
      history: { orderBy: { created_at: "desc" }, take: 20 },
      comments: { orderBy: { created_at: "desc" }, take: 20 },
    },
  });

  if (!incident) notFound();

  const guardians = await getGuardianOptions();

  return (
    <DashboardShell>
      <IncidentDetail incident={incident} guardians={guardians} />
    </DashboardShell>
  );
}
