import { DashboardShell } from "@/components/layout/dashboard-shell";
import { UsersTable } from "@/components/users/users-table";
import { getAppUsers } from "@/lib/actions/users";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function UsersPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const sp = await searchParams;
  const result = await getAppUsers({
    page: sp.page ? Number(sp.page) : 1,
    pageSize: sp.pageSize ? Number(sp.pageSize) : 20,
    search: typeof sp.search === "string" ? sp.search : undefined,
    status: (typeof sp.status === "string" ? sp.status : "all") as "all" | "active" | "suspended" | "banned",
    type: (typeof sp.type === "string" ? sp.type : "all") as "all" | "locataire" | "guardian",
    sortBy: (typeof sp.sortBy === "string" ? sp.sortBy : "created_at") as "created_at" | "nom" | "email",
    sortDir: (typeof sp.sortDir === "string" ? sp.sortDir : "desc") as "asc" | "desc",
  });

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Utilisateurs</h1>
          <p className="text-muted-foreground">Gestion des locataires et gardiens</p>
        </div>
        <UsersTable
          {...result}
          filters={{
            search: typeof sp.search === "string" ? sp.search : undefined,
            status: typeof sp.status === "string" ? sp.status : "all",
            type: typeof sp.type === "string" ? sp.type : "all",
            sortBy: typeof sp.sortBy === "string" ? sp.sortBy : "created_at",
            sortDir: typeof sp.sortDir === "string" ? sp.sortDir : "desc",
          }}
        />
      </div>
    </DashboardShell>
  );
}
