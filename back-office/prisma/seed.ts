import { PrismaClient, StaffRole } from "@prisma/client";
import { hashPassword } from "../src/lib/auth/password";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@cohabitat.app";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "SuperAdmin123!@#";

  const existing = await prisma.staffAccount.findUnique({ where: { email } });
  if (existing) {
    console.log(`Compte super_admin déjà présent: ${email}`);
    return;
  }

  const password_hash = await hashPassword(password);

  await prisma.staffAccount.create({
    data: {
      email,
      nom: "Admin",
      prenom: "Super",
      password_hash,
      role: StaffRole.super_admin,
      is_active: true,
    },
  });

  console.log("Compte super_admin créé:");
  console.log(`  Email: ${email}`);
  console.log(`  Mot de passe: ${password}`);
  console.log("  ⚠ Changez ce mot de passe en production.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
