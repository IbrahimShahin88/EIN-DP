import { headers } from "next/headers";
import { prisma } from "./db";

export async function writeAuditLog({
  tenantId,
  userId,
  action,
  entityType,
  entityId,
  oldValues,
  newValues,
}: {
  tenantId?: string | null;
  userId?: string | null;
  action: string;
  entityType?: string | null;
  entityId?: string | null;
  oldValues?: unknown;
  newValues?: unknown;
}) {
  const headerStore = await headers();

  await prisma.auditLog.create({
    data: {
      tenantId: tenantId ?? null,
      userId: userId ?? null,
      action,
      entityType: entityType ?? null,
      entityId: entityId ?? null,
      oldValues: oldValues === undefined ? undefined : JSON.parse(JSON.stringify(oldValues)),
      newValues: newValues === undefined ? undefined : JSON.parse(JSON.stringify(newValues)),
      ipAddress:
        headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        headerStore.get("x-real-ip") ??
        null,
      userAgent: headerStore.get("user-agent"),
    },
  });
}
