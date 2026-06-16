import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { SettingsView } from "@/components/settings/settings-view";
import { getOwnProfile } from "@/lib/actions/settings";
import { getSession } from "@/lib/auth/session";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const profile = await getOwnProfile();

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground">Profil et sécurité de votre compte</p>
        </div>
        <SettingsView profile={profile} />
      </div>
    </DashboardShell>
  );
}
