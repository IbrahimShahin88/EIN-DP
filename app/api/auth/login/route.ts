import { NextResponse } from "next/server";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { getRoleRedirectPath } from "@/lib/roles";
import { setSessionCookie } from "@/lib/session";
import { requireEmail, requirePassword } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const email = requireEmail(body.email);
    const password = requirePassword(body.password);

    const user = await prisma.user.findUnique({
      where: { email },
      include: { tenant: true },
    });

    if (!user || user.status !== "active") {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    if (user.tenant && !["active", "trial"].includes(user.tenant.status)) {
      return NextResponse.json({ error: "Tenant is not active." }, { status: 403 });
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    await setSessionCookie(user.id);

    await writeAuditLog({
      tenantId: user.tenantId,
      userId: user.id,
      action: "user_logged_in",
      entityType: "user",
      entityId: user.id,
    });

    const { passwordHash: _passwordHash, ...safeUser } = user;

    return NextResponse.json({
      user: safeUser,
      redirectPath: getRoleRedirectPath(user.role),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Login failed." },
      { status: 400 },
    );
  }
}
