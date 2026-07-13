import { PrismaClient, Role, TenantStatus, UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const demoPassword = "Ein@123456";

async function main() {
  const passwordHash = await bcrypt.hash(demoPassword, 12);

  const tenant = await prisma.tenant.upsert({
    where: { slug: "ein-demo-logistics-park" },
    update: {
      name: "Ein Demo Logistics Park",
      sector: "Logistics Park",
      country: "Egypt",
      city: "Ain Sokhna",
      status: TenantStatus.active,
    },
    create: {
      name: "Ein Demo Logistics Park",
      slug: "ein-demo-logistics-park",
      sector: "Logistics Park",
      country: "Egypt",
      city: "Ain Sokhna",
      status: TenantStatus.active,
    },
  });

  const users: Array<{
    email: string;
    fullName: string;
    role: Role;
    tenantId: string | null;
  }> = [
    {
      email: "superadmin@ein.app",
      fullName: "Ein Super Admin",
      role: Role.super_admin,
      tenantId: null,
    },
    {
      email: "tenantadmin@demo.ein.app",
      fullName: "Demo Tenant Admin",
      role: Role.tenant_admin,
      tenantId: tenant.id,
    },
    {
      email: "manager@demo.ein.app",
      fullName: "Demo Security Manager",
      role: Role.security_manager,
      tenantId: tenant.id,
    },
    {
      email: "supervisor@demo.ein.app",
      fullName: "Demo Supervisor",
      role: Role.supervisor,
      tenantId: tenant.id,
    },
    {
      email: "gate@demo.ein.app",
      fullName: "Demo Gate Officer",
      role: Role.gate_officer,
      tenantId: tenant.id,
    },
    {
      email: "guard@demo.ein.app",
      fullName: "Demo Guard",
      role: Role.guard,
      tenantId: tenant.id,
    },
    {
      email: "viewer@demo.ein.app",
      fullName: "Demo Viewer",
      role: Role.viewer,
      tenantId: tenant.id,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        fullName: user.fullName,
        role: user.role,
        tenantId: user.tenantId,
        status: UserStatus.active,
        passwordHash,
      },
      create: {
        fullName: user.fullName,
        email: user.email,
        passwordHash,
        role: user.role,
        tenantId: user.tenantId,
        status: UserStatus.active,
      },
    });
  }

  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      action: "seed_completed",
      entityType: "tenant",
      entityId: tenant.id,
      newValues: {
        demoUsers: users.map((user) => user.email),
        note: "Development/demo password only. Change before production.",
      },
    },
  });

  console.log("Seed complete.");
  console.log("Demo password for all seeded users: Ein@123456");
  console.log("This password is for development/demo only.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
