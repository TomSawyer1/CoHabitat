import { prisma } from "@/lib/db";
import { getRequestIp, type SessionData } from "@/lib/auth/session";

/**
 * Journalise une action d'administration dans `audit_logs`.
 * Ne doit jamais faire échouer l'action métier : les erreurs sont avalées
 * (mais loggées côté serveur).
 */
export async function logAudit(
  session: SessionData | null,
  action: string,
  targetType: string,
  targetId?: string | number,
  metadata?: Record<string, unknown>,
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        actor_id: session?.staff.id ?? null,
        actor_email: session?.staff.email ?? null,
        action,
        target_type: targetType,
        target_id: targetId !== undefined ? String(targetId) : null,
        metadata: metadata ? JSON.stringify(metadata) : null,
        ip_address: await getRequestIp(),
      },
    });
  } catch (error) {
    console.error("Audit log failure:", error);
  }
}
