import type { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { prisma } from "./db";
import { getSessionUserId } from "./session";

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

export async function getCurrentUser() {
  const userId = await getSessionUserId();
  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      tenant: true,
    },
  });

  if (!user || user.status !== "active") {
    return null;
  }

  if (user.tenant && !["active", "trial"].includes(user.tenant.status)) {
    return null;
  }

  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireRole(allowedRoles: Role[]) {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    redirect("/unauthorized");
  }

  return user;
}
