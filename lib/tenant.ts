import type { Role } from "@prisma/client";

export function requireTenantAccess(user: { role: Role; tenantId: string | null }, tenantId: string) {
  if (user.role === "super_admin") {
    return true;
  }

  return user.tenantId === tenantId;
}
