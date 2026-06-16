"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateIncidentStatus, assignIncident } from "@/lib/actions/incidents";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const STATUS_LABELS: Record<string, string> = { nouveau: "Nouveau", en_cours: "En cours", resolu: "Résolu" };
const STATUS_VARIANTS: Record<string, "default" | "warning" | "success" | "destructive"> = {
  nouveau: "destructive", en_cours: "warning", resolu: "success",
};

type Incident = {
  id: number;
  type: string;
  title: string | null;
  description: string;
  date: string;
  status: string;
  etage: string | null;
  numero_porte: string | null;
  resolution_comment: string | null;
  resolved_at: Date | null;
  created_at: Date;
  batiment: { nom: string; rue: string };
  locataire: { id: number; nom: string; prenom: string; email: string; telephone: string | null };
  assignedGuardian: { id: number; nom: string; prenom: string } | null;
  history: { id: number; action: string; old_status: string | null; new_status: string | null; comment: string | null; created_at: Date }[];
  comments: { id: number; comment: string; user_role: string; created_at: Date }[];
};

type Guardian = { id: number; nom: string; prenom: string };

export function IncidentDetail({ incident, guardians }: { incident: Incident; guardians: Guardian[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [selectedStatus, setSelectedStatus] = useState(incident.status);
  const [selectedGuardian, setSelectedGuardian] = useState(incident.assignedGuardian?.id?.toString() ?? "");

  function handleStatusChange() {
    startTransition(async () => {
      await updateIncidentStatus(incident.id, selectedStatus);
      toast.success("Statut mis à jour");
      router.refresh();
    });
  }

  function handleAssign() {
    startTransition(async () => {
      await assignIncident(incident.id, selectedGuardian ? Number(selectedGuardian) : null);
      toast.success("Gardien assigné");
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/incidents"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{incident.title ?? `Incident #${incident.id}`}</h1>
          <p className="text-muted-foreground text-sm">{incident.type} — {incident.batiment.nom}</p>
        </div>
        <Badge variant={STATUS_VARIANTS[incident.status] ?? "default"} className="ml-auto">
          {STATUS_LABELS[incident.status] ?? incident.status}
        </Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader><CardTitle>Description</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{incident.description}</p>
              {incident.etage && <p className="text-sm text-muted-foreground mt-2">Étage : {incident.etage}{incident.numero_porte ? ` — Porte ${incident.numero_porte}` : ""}</p>}
              {incident.resolution_comment && (
                <div className="mt-3 rounded-lg bg-muted/50 p-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Commentaire de résolution</p>
                  <p className="text-sm">{incident.resolution_comment}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {incident.history.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Historique</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {incident.history.map((h) => (
                    <div key={h.id} className="flex items-start gap-2 text-sm">
                      <span className="text-muted-foreground whitespace-nowrap">{formatDate(h.created_at)}</span>
                      <span>{h.action}{h.old_status && h.new_status ? ` : ${h.old_status} → ${h.new_status}` : ""}{h.comment ? ` — ${h.comment}` : ""}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Informations</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Signalé le :</span> {formatDate(incident.created_at)}</p>
              <p><span className="text-muted-foreground">Bâtiment :</span> {incident.batiment.nom}</p>
              <p><span className="text-muted-foreground">Adresse :</span> {incident.batiment.rue}</p>
              <p><span className="text-muted-foreground">Locataire :</span> {incident.locataire.prenom} {incident.locataire.nom}</p>
              <p><span className="text-muted-foreground">Email :</span> {incident.locataire.email}</p>
              {incident.locataire.telephone && <p><span className="text-muted-foreground">Tél :</span> {incident.locataire.telephone}</p>}
              {incident.resolved_at && <p><span className="text-muted-foreground">Résolu le :</span> {formatDate(incident.resolved_at)}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Changer le statut</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                <option value="nouveau">Nouveau</option>
                <option value="en_cours">En cours</option>
                <option value="resolu">Résolu</option>
              </Select>
              <Button onClick={handleStatusChange} disabled={pending || selectedStatus === incident.status} className="w-full">
                Mettre à jour
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Assigner un gardien</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Select value={selectedGuardian} onChange={(e) => setSelectedGuardian(e.target.value)}>
                <option value="">— Aucun —</option>
                {guardians.map((g) => (
                  <option key={g.id} value={g.id}>{g.prenom} {g.nom}</option>
                ))}
              </Select>
              <Button onClick={handleAssign} disabled={pending} variant="outline" className="w-full">
                Assigner
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
