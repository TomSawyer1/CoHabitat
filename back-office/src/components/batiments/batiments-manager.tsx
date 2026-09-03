"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createBatiment, updateBatiment, deleteBatiment } from "@/lib/actions/batiments";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Batiment = {
  id: number;
  nom: string;
  rue: string;
  nombre_etage: number | null;
  nombre_appartement: number | null;
  annee_construction: number | null;
  id_guardians: number | null;
  equipements: string | null;
  reglement: string | null;
  guardian: { nom: string; prenom: string } | null;
  _count: { locataires: number; incidents: number };
};

type Guardian = { id: number; nom: string; prenom: string };

type FormData = {
  nom: string;
  rue: string;
  nombre_etage: string;
  nombre_appartement: string;
  annee_construction: string;
  id_guardians: string;
  equipements: string;
  reglement: string;
};

const emptyForm: FormData = {
  nom: "", rue: "", nombre_etage: "", nombre_appartement: "",
  annee_construction: "", id_guardians: "", equipements: "", reglement: "",
};

function toFormData(b: Batiment): FormData {
  return {
    nom: b.nom,
    rue: b.rue,
    nombre_etage: b.nombre_etage != null ? String(b.nombre_etage) : "",
    nombre_appartement: b.nombre_appartement != null ? String(b.nombre_appartement) : "",
    annee_construction: b.annee_construction != null ? String(b.annee_construction) : "",
    id_guardians: b.id_guardians != null ? String(b.id_guardians) : "",
    equipements: b.equipements ?? "",
    reglement: b.reglement ?? "",
  };
}

function toPayload(f: FormData) {
  return {
    nom: f.nom,
    rue: f.rue,
    nombre_etage: f.nombre_etage ? Number(f.nombre_etage) : null,
    nombre_appartement: f.nombre_appartement ? Number(f.nombre_appartement) : null,
    annee_construction: f.annee_construction ? Number(f.annee_construction) : null,
    id_guardians: f.id_guardians ? Number(f.id_guardians) : null,
    equipements: f.equipements || null,
    reglement: f.reglement || null,
  };
}

export function BatimentsManager({ batiments, guardians }: { batiments: Batiment[]; guardians: Guardian[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [dialog, setDialog] = useState<{ mode: "create" | "edit" | "delete"; batiment?: Batiment } | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);

  function openCreate() { setForm(emptyForm); setDialog({ mode: "create" }); }
  function openEdit(b: Batiment) { setForm(toFormData(b)); setDialog({ mode: "edit", batiment: b }); }
  function openDelete(b: Batiment) { setDialog({ mode: "delete", batiment: b }); }

  function handleField(key: keyof FormData, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSave() {
    startTransition(async () => {
      const payload = toPayload(form);
      const result = dialog?.mode === "create"
        ? await createBatiment(payload)
        : await updateBatiment(dialog!.batiment!.id, payload);
      if ("error" in result) { toast.error(result.error as string); return; }
      toast.success(dialog?.mode === "create" ? "Bâtiment créé" : "Bâtiment mis à jour");
      setDialog(null);
      router.refresh();
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteBatiment(dialog!.batiment!.id);
      if ("error" in result) { toast.error(result.error as string); return; }
      toast.success("Bâtiment supprimé");
      setDialog(null);
      router.refresh();
    });
  }

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={openCreate}><Plus className="h-4 w-4" />Nouveau bâtiment</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {batiments.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground py-12">Aucun bâtiment</p>
        )}
        {batiments.map((b) => (
          <Card key={b.id}>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Building className="h-4 w-4 shrink-0 text-primary" />
                  <p className="font-semibold truncate">{b.nom}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(b)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => openDelete(b)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{b.rue}</p>
              <div className="flex gap-3 text-xs text-muted-foreground">
                {b.nombre_etage != null && <span>{b.nombre_etage} étages</span>}
                {b.nombre_appartement != null && <span>{b.nombre_appartement} appts</span>}
              </div>
              <div className="flex gap-3 text-xs">
                <span>{b._count.locataires} locataires</span>
                <span>{b._count.incidents} incidents</span>
              </div>
              {b.guardian && (
                <p className="text-xs text-muted-foreground">Gardien : {b.guardian.prenom} {b.guardian.nom}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create / Edit dialog */}
      <Dialog open={dialog?.mode === "create" || dialog?.mode === "edit"} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dialog?.mode === "create" ? "Nouveau bâtiment" : "Modifier le bâtiment"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {([
              ["nom", "Nom *", "text"],
              ["rue", "Adresse *", "text"],
              ["nombre_etage", "Nombre d'étages", "number"],
              ["nombre_appartement", "Nombre d'appartements", "number"],
              ["annee_construction", "Année de construction", "number"],
            ] as [keyof FormData, string, string][]).map(([key, label, type]) => (
              <div key={key} className="space-y-1">
                <Label>{label}</Label>
                <Input type={type} value={form[key]} onChange={(e) => handleField(key, e.target.value)} />
              </div>
            ))}
            <div className="space-y-1">
              <Label>Gardien assigné</Label>
              <Select value={form.id_guardians} onChange={(e) => handleField("id_guardians", e.target.value)}>
                <option value="">— Aucun —</option>
                {guardians.map((g) => (
                  <option key={g.id} value={g.id}>{g.prenom} {g.nom}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Équipements</Label>
              <Input value={form.equipements} onChange={(e) => handleField("equipements", e.target.value)} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialog(null)}>Annuler</Button>
              <Button onClick={handleSave} disabled={pending || !form.nom || !form.rue}>
                {dialog?.mode === "create" ? "Créer" : "Enregistrer"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirm dialog */}
      <Dialog open={dialog?.mode === "delete"} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer &quot;{dialog?.batiment?.nom}&quot; ?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Cette action est irréversible.</p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDialog(null)}>Annuler</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={pending}>Supprimer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
