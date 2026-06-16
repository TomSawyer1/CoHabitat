import { cookies, headers } from "next/headers";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { generateCsrfToken, generateToken, hashToken } from "@/lib/auth/tokens";
import type { StaffAccount } from "@prisma/client";

export const SESSION_COOKIE = "cohabitat_session";

export type SessionStaff = Pick<
  StaffAccount,
  "id" | "email" | "nom" | "prenom" | "role" | "totp_enabled" | "is_active"
>;

export type SessionData = {
  staff: SessionStaff;
};

export async function createSession(staffId: number): Promise<{ token: string }> {
  const token = generateToken();
  const tokenHash = hashToken(token);
  const csrfToken = generateCsrfToken();
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? "unknown";
  const userAgent = h.get("user-agent") ?? undefined;
  const expiresAt = new Date(Date.now() + env.SESSION_MAX_AGE * 1000);

  await prisma.staffSession.create({
    data: {
      staff_id: staffId,
      token_hash: tokenHash,
      csrf_token: csrfToken,
      ip_address: ip,
      user_agent: userAgent,
      expires_at: expiresAt,
    },
  });

  await prisma.staffAccount.update({
    where: { id: staffId },
    data: { last_login_at: new Date() },
  });

  return { token };
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: env.SESSION_MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.staffSession.deleteMany({ where: { token_hash: hashToken(token) } });
  }
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.staffSession.findUnique({
    where: { token_hash: hashToken(token) },
    include: {
      staff: {
        select: {
          id: true,
          email: true,
          nom: true,
          prenom: true,
          role: true,
          totp_enabled: true,
          is_active: true,
        },
      },
    },
  });

  if (!session) return null;
  if (session.expires_at < new Date()) {
    await prisma.staffSession.delete({ where: { id: session.id } });
    return null;
  }

  const inactiveMs = Date.now() - session.last_active.getTime();
  if (inactiveMs > env.SESSION_INACTIVITY_TIMEOUT * 1000) {
    await prisma.staffSession.delete({ where: { id: session.id } });
    return null;
  }

  if (!session.staff.is_active) return null;

  await prisma.staffSession.update({
    where: { id: session.id },
    data: { last_active: new Date() },
  });

  return { staff: session.staff };
}

export async function requireSession(): Promise<SessionData> {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}
