import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { optionalString, requireNumber, requireString } from "@/lib/validators";

export async function GET() {
  await requireUser();

  const checkpoints = await query(`
    SELECT
      checkpoints.id,
      checkpoints.zone_id,
      zones.name AS zone_name,
      sites.id AS site_id,
      sites.name AS site_name,
      clients.id AS client_id,
      clients.name AS client_name,
      checkpoints.name,
      checkpoints.qr_code,
      checkpoints.location_note,
      checkpoints.status,
      checkpoints.created_at
    FROM checkpoints
    LEFT JOIN zones ON zones.id = checkpoints.zone_id
    LEFT JOIN sites ON sites.id = zones.site_id
    LEFT JOIN clients ON clients.id = sites.client_id
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
    const qrCode = optionalString(body.qrCode, 255) ?? `AYN-${randomUUID()}`;

    const result = await query(
      `
        INSERT INTO checkpoints (zone_id, name, qr_code, location_note, status)
        VALUES (?, ?, ?, ?, 'active')
      `,
      [
        requireNumber(body.zoneId, "zoneId"),
        requireString(body.name, "name"),
        qrCode,
        optionalString(body.locationNote),
      ],
    );

    return NextResponse.json({ ok: true, qrCode, result }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Checkpoint creation failed." },
      { status: 400 },
    );
  }
}
