import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getIncidents } from "@/lib/actions/incidents";
import { getBatiments } from "@/lib/actions/batiments";
import { getSession } from "@/lib/auth/session";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { formatShortDate } from "@/lib/utils";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const STATUS_LABELS: Record<string, string> = {
  nouveau: "Nouveau",
  en_cours: "En cours",
  resolu: "Résolu",
};

const STATUS_VARIANTS: Record<string, "default" | "warning" | "success" | "destructive"> = {
  nouveau: "destructive",
  en_cours: "warning",
  resolu: "success",
};

export default async function IncidentsPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const sp = await searchParams;
  const batiments = await getBatiments();
  const result = await getIncidents({
    page: sp.page ? Number(sp.page) : 1,
    status: typeof sp.status === "string" && sp.status ? sp.status : undefined,
    batimentId: typeof sp.batimentId === "string" && sp.batimentId ? Number(sp.batimentId) : undefined,
    search: typeof sp.search === "string" ? sp.search : undefined,
  });

  function buildQuery(page: number) {
    const params = new URLSearchParams();
    params.set("page", String(page));
    if (typeof sp.status === "string" && sp.status) params.set("status", sp.status);
    if (typeof sp.batimentId === "string" && sp.batimentId) params.set("batimentId", sp.batimentId);
    if (typeof sp.search === "string" && sp.search) params.set("search", sp.search);
    return `/incidents?${params.toString()}`;
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Incidents</h1>
          <p className="text-muted-foreground">Suivi des signalements</p>
        </div>

        <form className="flex flex-wrap gap-3" action="/incidents" method="get">
          <Input name="search" placeholder="Rechercher…" defaultValue={typeof sp.search === "string" ? sp.search : ""} className="max-w-xs" />
          <Select name="status" defaultValue={typeof sp.status === "string" ? sp.status : ""}>
            <option value="">Tous les statuts</option>
            <option value="nouveau">Nouveau</option>
            <option value="en_cours">En cours</option>
            <option value="resolu">Résolu</option>
          </Select>
          <Select name="batimentId" defaultValue={typeof sp.batimentId === "string" ? sp.batimentId : ""}>
            <option value="">Tous les bâtiments</option>
            {batiments.map((b) => (
              <option key={b.id} value={b.id}>{b.nom}</option>
            ))}
          </Select>
          <Button type="submit">Filtrer</Button>
        </form>

        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Titre</th>
                <th className="px-4 py-3 text-left">Bâtiment</th>
                <th className="px-4 py-3 text-left">Locataire</th>
                <th className="px-4 py-3 text-left">Gardien</th>
                <th className="px-4 py-3 text-left">Statut</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {result.data.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">Aucun incident</td>
                </tr>
              ) : (
                result.data.map((inc) => (
                  <tr key={inc.id} className="border-t border-border">
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{formatShortDate(inc.created_at)}</td>
                    <td className="px-4 py-3 font-mono text-xs">{inc.type}</td>
                    <td className="px-4 py-3">{inc.title ?? "—"}</td>
                    <td className="px-4 py-3">{inc.batiment.nom}</td>
                    <td className="px-4 py-3">{inc.locataire.prenom} {inc.locataire.nom}</td>
                    <td className="px-4 py-3">{inc.assignedGuardian ? `${inc.assignedGuardian.prenom} ${inc.assignedGuardian.nom}` : "—"}</td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_VARIANTS[inc.status] ?? "default"}>
                        {STATUS_LABELS[inc.status] ?? inc.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/incidents/${inc.id}`}>Voir</Link>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>{result.total} incident(s) — page {result.page}/{result.totalPages || 1}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={result.page <= 1} asChild>
              <Link href={buildQuery(result.page - 1)}>Précédent</Link>
            </Button>
            <Button variant="outline" size="sm" disabled={result.page >= result.totalPages} asChild>
              <Link href={buildQuery(result.page + 1)}>Suivant</Link>
            </Button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
