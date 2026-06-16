"use client";

import { logoutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <Button variant="outline" size="sm" onClick={() => logoutAction()}>
      <LogOut className="h-4 w-4" />
      Déconnexion
    </Button>
  );
}
