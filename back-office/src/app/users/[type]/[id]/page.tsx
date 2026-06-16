import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { UserDetailView } from "@/components/users/user-detail-view";
import { getAppUserDetail } from "@/lib/actions/users";
import { getSession } from "@/lib/auth/session";
import type { AppUserType } from "@/lib/actions/users";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

type Params = Promise<{ type: string; id: string }>;

export default async function UserDetailPage({ params }: { params: Params }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { type, id } = await params;
  if (type !== "locataire" && type !== "guardian") notFound();

  const detail = await getAppUserDetail(type as AppUserType, Number(id));
  if (!detail) notFound();

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/users"><ChevronLeft className="h-4 w-4" />Retour</Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Fiche utilisateur</h1>
        </div>
        <UserDetailView detail={detail} />
      </div>
    </DashboardShell>
  );
}
