"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { AppUserType } from "@/lib/actions/users";
import { deleteAppUser, resetAppUserPassword, setAppUserStatus, updateAppUser } from "@/lib/actions/users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const STATUS_LABELS: Record<string, string> = { active: "Actif", suspended: "Suspendu", banned: "Banni" };

type UserDetail = NonNullable<Awaited<ReturnType<typeof import("@/lib/actions/users").getAppUserDetail>>>;

export function UserDetailView({ detail }: { detail: UserDetail }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [showDelete, setShowDelete] = useState(false);
  const user = detail.user;
  const incidents =
    detail.type === "locataire"
      ? "incidents" in user ? user.incidents : []
      : "assignedIncidents" in user ? user.assignedIncidents : [];

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await updateAppUser(detail.type, user.id, {
        nom: String(fd.get("nom")),
        prenom: String(fd.get("prenom")),
        email: String(fd.get("email")),
        telephone: String(fd.get("telephone") || "") || null,
      });
      toast.success("Profil mis à jour");
      router.refresh();
    });
  }

  function handleStatus(status: "active" | "suspended" | "banned") {
    startTransition(async () => {
      await setAppUserStatus(detail.type, user.id, status);
      toast.success("Statut mis à jour");
      router.refresh();
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>{user.prenom} {user.nom}</CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline">{detail.type === "locataire" ? "Locataire" : "Gardien"}</Badge>
            <Badge>{STATUS_LABELS[user.status] ?? user.status}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdate} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom</Label>
              <Input id="prenom" name="prenom" defaultValue={user.prenom} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nom">Nom</Label>
              <Input id="nom" name="nom" defaultValue={user.nom} required />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={user.email} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input id="telephone" name="telephone" defaultValue={user.telephone ?? ""} />
            </div>
            <div className="space-y-2">
              <Label>Bâtiment</Label>
              <Input value={user.batiment?.nom ?? "—"} disabled />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={pending}>Enregistrer</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Actions</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" variant="outline" onClick={() => handleStatus("active")}>Réactiver</Button>
            <Button className="w-full" variant="outline" onClick={() => handleStatus("suspended")}>Suspendre</Button>
            <Button className="w-full" variant="outline" onClick={() => handleStatus("banned")}>Bannir</Button>
            <ResetPasswordForm type={detail.type} userId={user.id} />
            <Button className="w-full" variant="destructive" onClick={() => setShowDelete(true)}>Supprimer</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Informations</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Inscrit le :</span> {formatDate(user.created_at)}</p>
            <p><span className="text-muted-foreground">Mis à jour :</span> {formatDate(user.updated_at)}</p>
            {detail.type === "guardian" && "guardian_number" in user && (
              <p><span className="text-muted-foreground">N° gardien :</span> {user.guardian_number ?? "—"}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="lg:col-span-3">
        <CardHeader><CardTitle className="text-base">Activité récente — Incidents</CardTitle></CardHeader>
        <CardContent>
          {incidents.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun incident</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-2 pr-4">Titre</th>
                    <th className="pb-2 pr-4">Statut</th>
                    <th className="pb-2 pr-4">Bâtiment</th>
                    <th className="pb-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.map((inc) => (
                    <tr key={inc.id} className="border-b border-border/50">
                      <td className="py-2 pr-4">{inc.title ?? inc.type}</td>
                      <td className="py-2 pr-4">{inc.status}</td>
                      <td className="py-2 pr-4">{inc.batiment.nom}</td>
                      <td className="py-2">{formatDate(inc.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>Cette action est définitive.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDelete(false)}>Annuler</Button>
            <Button variant="destructive" onClick={() =>
              startTransition(async () => {
                await deleteAppUser(detail.type, user.id);
                toast.success("Utilisateur supprimé");
                router.push("/users");
              })
            }>Supprimer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ResetPasswordForm({ type, userId }: { type: AppUserType; userId: number }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <Button className="w-full" variant="secondary" onClick={() => setOpen(true)}>
        Réinitialiser mot de passe
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouveau mot de passe</DialogTitle>
            <DialogDescription>Le mot de passe sera hashé avec argon2id.</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const password = new FormData(e.currentTarget).get("password") as string;
              startTransition(async () => {
                const result = await resetAppUserPassword(type, userId, password);
                if (result.error) toast.error(result.error);
                else { toast.success("Mot de passe réinitialisé"); setOpen(false); }
              });
            }}
            className="space-y-4"
          >
            <Input name="password" type="password" minLength={12} required placeholder="Nouveau mot de passe" />
            <Button type="submit" disabled={pending}>Confirmer</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
