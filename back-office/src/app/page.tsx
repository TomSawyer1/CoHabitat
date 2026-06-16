import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DashboardCharts, KpiCard } from "@/components/dashboard/dashboard-charts";
import { getDashboardStats } from "@/lib/actions/dashboard";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground">Vue d&apos;ensemble de la plateforme CoHabitat</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard title="Utilisateurs totaux" value={stats.totalUsers} hint={`${stats.locataireCount} locataires · ${stats.guardianCount} gardiens`} />
          <KpiCard title="Utilisateurs actifs" value={stats.activeUsers} />
          <KpiCard title="Nouveaux (aujourd'hui)" value={stats.newToday} hint={`${stats.newWeek} cette semaine · ${stats.newMonth} ce mois`} />
          <KpiCard title="Comptes restreints" value={stats.suspended + stats.banned} hint={`${stats.suspended} suspendus · ${stats.banned} bannis`} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <KpiCard title="Incidents totaux" value={stats.incidentCount} />
          <KpiCard
            title="Incidents ouverts"
            value={
              stats.incidentsByStatus
                .filter((s) => s.status === "nouveau" || s.status === "en_cours")
                .reduce((acc, s) => acc + s.count, 0)
            }
          />
        </div>

        <DashboardCharts stats={stats} />
      </div>
    </DashboardShell>
  );
}
