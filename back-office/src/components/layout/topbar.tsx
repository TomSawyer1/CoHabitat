"use client";

import { LogoutButton } from "@/components/auth/logout-button";
import type { SessionStaff } from "@/lib/auth/session";
import { Moon, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function Topbar({ staff }: { staff: SessionStaff }) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur">
      <p className="font-medium">{staff.prenom} {staff.nom}</p>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Changer le thème"
          className="relative"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Paramètres" asChild>
          <a href="/settings"><User className="h-4 w-4" /></a>
        </Button>
        <LogoutButton />
      </div>
    </header>
  );
}
