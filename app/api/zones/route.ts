import { NextResponse } from "next/server";
import type { ResultSetHeader } from "mysql2";
import { requireUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { requireNumber, requireString } from "@/lib/validators";

export async function GET() {
  await requireUser();

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
    const result = await query<ResultSetHeader>(
      `
        INSERT INTO zones (site_id, name)
        VALUES (?, ?)
      `,
      [requireNumber(body.siteId, "siteId"), requireString(body.name, "name")],
    );

    return NextResponse.json({ id: result.insertId }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Zone creation failed." },
      { status: 400 },
    );
  }
}
