"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useReactTable, getCoreRowModel, flexRender, type ColumnDef } from "@tanstack/react-table";
import type { AppUserRow } from "@/lib/actions/users";
import { bulkSetAppUserStatus, exportAppUsersCsv, setAppUserStatus, deleteAppUser } from "@/lib/actions/users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { Download, Eye, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const STATUS_LABELS: Record<string, string> = { active: "Actif", suspended: "Suspendu", banned: "Banni" };

type Props = {
  data: AppUserRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  filters: { search?: string; status: string; type: string; sortBy: string; sortDir: string };
};

function statusVariant(status: string) {
  if (status === "active") return "success" as const;
  if (status === "suspended") return "warning" as const;
  return "destructive" as const;
}

export function UsersTable({ data, total, page, pageSize, totalPages, filters }: Props) {
  const [selected, setSelected] = useState<{ type: AppUserRow["type"]; id: number }[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<AppUserRow | null>(null);
  const [pending, startTransition] = useTransition();

  const columns = useMemo<ColumnDef<AppUserRow>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => <input type="checkbox" aria-label="Tout sélectionner" checked={table.getIsAllPageRowsSelected()} onChange={table.getToggleAllPageRowsSelectedHandler()} />,
        cell: ({ row }) => <input type="checkbox" aria-label="Sélectionner" checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} />,
      },
      {
        accessorKey: "prenom",
        header: "Nom",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.prenom} {row.original.nom}</p>
            <p className="text-xs text-muted-foreground">{row.original.email}</p>
          </div>
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ getValue }) => <Badge variant="outline">{getValue<string>() === "locataire" ? "Locataire" : "Gardien"}</Badge>,
      },
      {
        accessorKey: "batimentNom",
        header: "Bâtiment",
        cell: ({ getValue }) => getValue<string | null>() ?? "—",
      },
      {
        accessorKey: "status",
        header: "Statut",
        cell: ({ getValue }) => { const s = getValue<string>(); return <Badge variant={statusVariant(s)}>{STATUS_LABELS[s] ?? s}</Badge>; },
      },
      {
        accessorKey: "created_at",
        header: "Inscription",
        cell: ({ getValue }) => formatDate(getValue<Date>()),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/users/${row.original.type}/${row.original.id}`}><Eye className="h-4 w-4" /></Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setConfirmDelete(row.original)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: (updater) => {
      const next = typeof updater === "function" ? updater(Object.fromEntries(selected.map((s) => [`${s.type}-${s.id}`, true]))) : updater;
      const rows = Object.keys(next).filter((k) => next[k]);
      setSelected(rows.map((key) => { const row = data.find((d) => `${d.type}-${d.id}` === key); return row ? { type: row.type, id: row.id } : null; }).filter(Boolean) as { type: AppUserRow["type"]; id: number }[]);
    },
    getRowId: (row) => `${row.type}-${row.id}`,
  });

  function buildQuery(overrides: Record<string, string | number>) {
    const params = new URLSearchParams({
      page: String(overrides.page ?? page),
      pageSize: String(pageSize),
      status: filters.status,
      type: filters.type,
      sortBy: filters.sortBy,
      sortDir: filters.sortDir,
      ...(filters.search ? { search: filters.search } : {}),
      ...Object.fromEntries(Object.entries(overrides).map(([k, v]) => [k, String(v)])),
    });
    return `/users?${params.toString()}`;
  }

  function handleExport() {
    startTransition(async () => {
      const csv = await exportAppUsersCsv();
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cohabitat-users-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Export CSV téléchargé");
    });
  }

  function handleBulkStatus(status: "active" | "suspended" | "banned") {
    if (!selected.length) return;
    startTransition(async () => {
      await bulkSetAppUserStatus(selected, status);
      toast.success(`${selected.length} utilisateur(s) mis à jour`);
      window.location.reload();
    });
  }

  return (
    <div className="space-y-4">
      <form className="flex flex-wrap gap-3" action="/users" method="get">
        <Input name="search" placeholder="Rechercher nom, email…" defaultValue={filters.search} className="max-w-xs" />
        <Select name="status" defaultValue={filters.status}>
          <option value="all">Tous statuts</option>
          <option value="active">Actifs</option>
          <option value="suspended">Suspendus</option>
          <option value="banned">Bannis</option>
        </Select>
        <Select name="type" defaultValue={filters.type}>
          <option value="all">Tous types</option>
          <option value="locataire">Locataires</option>
          <option value="guardian">Gardiens</option>
        </Select>
        <Select name="sortBy" defaultValue={filters.sortBy}>
          <option value="created_at">Date inscription</option>
          <option value="nom">Nom</option>
          <option value="email">Email</option>
        </Select>
        <Select name="sortDir" defaultValue={filters.sortDir}>
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </Select>
        <Button type="submit">Filtrer</Button>
        <Button type="button" variant="outline" onClick={handleExport} disabled={pending}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Export CSV
        </Button>
      </form>

      {selected.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/50 p-3">
          <span className="text-sm">{selected.length} sélectionné(s)</span>
          <Button size="sm" variant="outline" onClick={() => handleBulkStatus("suspended")}>Suspendre</Button>
          <Button size="sm" variant="outline" onClick={() => handleBulkStatus("banned")}>Bannir</Button>
          <Button size="sm" variant="outline" onClick={() => handleBulkStatus("active")}>Réactiver</Button>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 text-left font-medium">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr><td colSpan={columns.length} className="px-4 py-12 text-center text-muted-foreground">Aucun utilisateur trouvé</td></tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-t border-border hover:bg-muted/30">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>{total} résultat(s) — page {page}/{totalPages || 1}</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} asChild>
            <Link href={buildQuery({ page: page - 1 })}>Précédent</Link>
          </Button>
          <Button variant="outline" size="sm" disabled={page >= totalPages} asChild>
            <Link href={buildQuery({ page: page + 1 })}>Suivant</Link>
          </Button>
        </div>
      </div>

      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l&apos;utilisateur ?</DialogTitle>
            <DialogDescription>
              Cette action est irréversible. Le compte {confirmDelete?.prenom} {confirmDelete?.nom} sera définitivement supprimé.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>Annuler</Button>
            <Button variant="destructive" disabled={pending} onClick={() => {
              if (!confirmDelete) return;
              startTransition(async () => {
                await deleteAppUser(confirmDelete.type, confirmDelete.id);
                toast.success("Utilisateur supprimé");
                setConfirmDelete(null);
                window.location.reload();
              });
            }}>Supprimer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export { setAppUserStatus };
