import { NextResponse } from "next/server";
import type { ResultSetHeader } from "mysql2";
import { requireUser } from "@/lib/auth";
import { isDatabaseConfigured, query } from "@/lib/db";
import { createDemoZone, getDemoStore } from "@/lib/demo-store";
import { requireNumber, requireString } from "@/lib/validators";

export async function GET() {
  await requireUser();

  if (!isDatabaseConfigured()) {
    const store = getDemoStore();
    return NextResponse.json({
      zones: store.zones.map((zone) => ({
        ...zone,
        site_name: store.sites.find((site) => site.id === zone.site_id)?.name ?? null,
      })),
    });
  }

  const zones = await query(`
    SELECT zones.id, zones.site_id, sites.name AS site_name, zones.name, zones.created_at
    FROM zones
    LEFT JOIN sites ON sites.id = zones.site_id
    ORDER BY zones.created_at DESC
    LIMIT 200
  `);

  return NextResponse.json({ zones });
}

export async function POST(request: Request) {
  const user = await requireUser();
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const siteId = requireNumber(body.siteId, "siteId");
    const name = requireString(body.name, "name");

    if (!isDatabaseConfigured()) {
      const zone = createDemoZone(siteId, name);
      return NextResponse.json({ id: zone.id, zone }, { status: 201 });
    }

    const result = await query<ResultSetHeader>(
      `
        INSERT INTO zones (site_id, name)
        VALUES (?, ?)
      `,
      [siteId, name],
    );

    return NextResponse.json({ id: result.insertId }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Zone creation failed." },
      { status: 400 },
    );
  }
}
