import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { optionalString, requireString } from "@/lib/validators";

export async function GET() {
  await requireUser();

  const checkpoints = await query(`
    SELECT checkpoints.id, checkpoints.zone_id, checkpoints.name, checkpoints.qr_code, checkpoints.location_note, checkpoints.status, checkpoints.created_at
    FROM checkpoints
    ORDER BY checkpoints.created_at DESC
    LIMIT 200
  `);

  return NextResponse.json({ checkpoints });
}

export async function POST(request: Request) {
  const user = await requireUser();
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const zoneId = Number(body.zoneId);
    if (!Number.isInteger(zoneId)) {
      throw new Error("zoneId is required.");
    }

    const result = await query(
      `
        INSERT INTO checkpoints (zone_id, name, qr_code, location_note, status)
        VALUES (?, ?, ?, ?, 'active')
      `,
      [
        zoneId,
        requireString(body.name, "name"),
        requireString(body.qrCode, "qrCode"),
        optionalString(body.locationNote),
      ],
    );

    return NextResponse.json({ ok: true, result }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Checkpoint creation failed." },
      { status: 400 },
    );
  }
}
