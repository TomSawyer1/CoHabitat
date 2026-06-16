"use client";

import { useTransition } from "react";
import { changeOwnPassword } from "@/lib/actions/settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

type Profile = Awaited<ReturnType<typeof import("@/lib/actions/settings").getOwnProfile>>;

export function SettingsView({ profile }: { profile: Profile }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <CardHeader><CardTitle>Profil</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><span className="text-muted-foreground">Nom :</span> {profile.prenom} {profile.nom}</p>
          <p><span className="text-muted-foreground">Email :</span> {profile.email}</p>
          <p><span className="text-muted-foreground">Dernière connexion :</span> {formatDate(profile.last_login_at)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Changer le mot de passe</CardTitle></CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              startTransition(async () => {
                const result = await changeOwnPassword({
                  currentPassword: String(fd.get("currentPassword")),
                  newPassword: String(fd.get("newPassword")),
                });
                if (result.error) toast.error(result.error);
                else { toast.success("Mot de passe modifié"); (e.target as HTMLFormElement).reset(); }
              });
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mot de passe actuel</Label>
              <Input id="currentPassword" name="currentPassword" type="password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <Input id="newPassword" name="newPassword" type="password" minLength={12} required />
            </div>
            <Button type="submit" disabled={pending}>Mettre à jour</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
