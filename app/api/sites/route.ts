import { NextResponse } from "next/server";
import type { ResultSetHeader } from "mysql2";
import { requireUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { optionalString, requireNumber, requireString } from "@/lib/validators";

export async function GET() {
  await requireUser();

  const sites = await query(`
    SELECT sites.id, sites.client_id, clients.name AS client_name, sites.name, sites.address, sites.status, sites.created_at
    FROM sites
    LEFT JOIN clients ON clients.id = sites.client_id
    ORDER BY sites.created_at DESC
    LIMIT 200
  `);

  return NextResponse.json({ sites });
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
        INSERT INTO sites (client_id, name, address, status)
        VALUES (?, ?, ?, ?)
      `,
      [
        requireNumber(body.clientId, "clientId"),
        requireString(body.name, "name"),
        optionalString(body.address),
        optionalString(body.status, 50) ?? "active",
      ],
    );

    return NextResponse.json({ id: result.insertId }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Site creation failed." },
      { status: 400 },
    );
  }
}
