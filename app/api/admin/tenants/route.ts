import { NextResponse } from "next/server";
import { TenantStatus } from "@prisma/client";
import { requireRole } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { optionalString, requireEnum, requireString } from "@/lib/validators";

const tenantStatuses = Object.values(TenantStatus) as [TenantStatus, ...TenantStatus[]];

export async function GET() {
  await requireRole(["super_admin"]);

  const tenants = await prisma.tenant.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ tenants });
}

export async function POST(request: Request) {
  const user = await requireRole(["super_admin"]);

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const tenant = await prisma.tenant.create({
      data: {
        name: requireString(body.name, "name"),
        slug: requireString(body.slug, "slug"),
        sector: optionalString(body.sector),
        country: optionalString(body.country),
        city: optionalString(body.city),
        status: body.status ? requireEnum(body.status, "status", tenantStatuses) : TenantStatus.pending_setup,
      },
    });

    await writeAuditLog({
      tenantId: tenant.id,
      userId: user.id,
      action: "tenant_created",
      entityType: "tenant",
      entityId: tenant.id,
      newValues: tenant,
    });

    return NextResponse.json({ tenant }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Tenant creation failed." },
      { status: 400 },
    );
  }
}
