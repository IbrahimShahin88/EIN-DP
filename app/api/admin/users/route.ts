import { NextResponse } from "next/server";
import { Role, UserStatus } from "@prisma/client";
import { requireRole } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { optionalString, requireEmail, requireEnum, requirePassword, requireString } from "@/lib/validators";

const roles = Object.values(Role) as [Role, ...Role[]];
const userStatuses = Object.values(UserStatus) as [UserStatus, ...UserStatus[]];

export async function GET() {
  await requireRole(["super_admin"]);

  const users = await prisma.user.findMany({
    include: { tenant: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    users: users.map(({ passwordHash: _passwordHash, ...user }) => user),
  });
}

export async function POST(request: Request) {
  const actor = await requireRole(["super_admin"]);

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const password = requirePassword(body.password);
    const role = requireEnum(body.role, "role", roles);
    const tenantId = optionalString(body.tenantId);

    if (role !== "super_admin" && !tenantId) {
      throw new Error("tenantId is required for tenant users.");
    }

    const user = await prisma.user.create({
      data: {
        fullName: requireString(body.fullName, "fullName"),
        email: requireEmail(body.email),
        passwordHash: await hashPassword(password),
        role,
        tenantId,
        status: body.status ? requireEnum(body.status, "status", userStatuses) : UserStatus.active,
      },
      include: { tenant: true },
    });

    await writeAuditLog({
      tenantId: user.tenantId,
      userId: actor.id,
      action: "user_created",
      entityType: "user",
      entityId: user.id,
      newValues: {
        id: user.id,
        tenantId: user.tenantId,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });

    const { passwordHash: _passwordHash, ...safeUser } = user;
    return NextResponse.json({ user: safeUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "User creation failed." },
      { status: 400 },
    );
  }
}
