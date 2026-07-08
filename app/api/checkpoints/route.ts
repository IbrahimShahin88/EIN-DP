import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireUser } from "@/lib/auth";
import { isDatabaseConfigured, query } from "@/lib/db";
import { createDemoCheckpoint, getDemoStore } from "@/lib/demo-store";
import { optionalString, requireNumber, requireString } from "@/lib/validators";

export async function GET() {
  await requireUser();

  if (!isDatabaseConfigured()) {
    const store = getDemoStore();
    return NextResponse.json({
      checkpoints: store.checkpoints.map((checkpoint) => {
        const zone = store.zones.find((item) => item.id === checkpoint.zone_id);
        const site = zone ? store.sites.find((item) => item.id === zone.site_id) : null;
        const client = site ? store.clients.find((item) => item.id === site.client_id) : null;
        return {
          ...checkpoint,
          zone_name: zone?.name ?? null,
          site_id: site?.id ?? null,
          site_name: site?.name ?? null,
          client_id: client?.id ?? null,
          client_name: client?.name ?? null,
        };
      }),
    });
  }

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
    const zoneId = requireNumber(body.zoneId, "zoneId");
    const name = requireString(body.name, "name");
    const qrCode = optionalString(body.qrCode, 255) ?? `AYN-${randomUUID()}`;
    const locationNote = optionalString(body.locationNote);

    if (!isDatabaseConfigured()) {
      const checkpoint = createDemoCheckpoint({ zoneId, name, qrCode, locationNote });
      return NextResponse.json({ ok: true, qrCode, id: checkpoint.id, checkpoint }, { status: 201 });
    }

    const result = await query(
      `
        INSERT INTO checkpoints (zone_id, name, qr_code, location_note, status)
        VALUES (?, ?, ?, ?, 'active')
      `,
      [
        zoneId,
        name,
        qrCode,
        locationNote,
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
