import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { BatimentsManager } from "@/components/batiments/batiments-manager";
import { getBatiments, getGuardianOptions } from "@/lib/actions/batiments";
import { getSession } from "@/lib/auth/session";

export default async function BatimentsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [batiments, guardians] = await Promise.all([getBatiments(), getGuardianOptions()]);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bâtiments</h1>
          <p className="text-muted-foreground">Gestion du parc immobilier</p>
        </div>
        <BatimentsManager batiments={batiments} guardians={guardians} />
      </div>
    </DashboardShell>
  );
}
