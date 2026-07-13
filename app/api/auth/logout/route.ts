import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { clearSessionCookie } from "@/lib/session";

export async function POST() {
  const user = await getCurrentUser();

  if (user) {
    await writeAuditLog({
      tenantId: user.tenantId,
      userId: user.id,
      action: "user_logged_out",
      entityType: "user",
      entityId: user.id,
    });
  }

  await clearSessionCookie();

  return NextResponse.json({ ok: true });
}
