import { NextResponse } from "next/server";
import type { ResultSetHeader } from "mysql2";
import { requireUser } from "@/lib/auth";
import { isDatabaseConfigured, query } from "@/lib/db";
import { createDemoSite, getDemoStore } from "@/lib/demo-store";
import { optionalString, requireNumber, requireString } from "@/lib/validators";

export async function GET() {
  await requireUser();

  if (!isDatabaseConfigured()) {
    const store = getDemoStore();
    return NextResponse.json({
      sites: store.sites.map((site) => ({
        ...site,
        client_name: store.clients.find((client) => client.id === site.client_id)?.name ?? null,
      })),
    });
  }

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
    const clientId = requireNumber(body.clientId, "clientId");
    const name = requireString(body.name, "name");
    const address = optionalString(body.address);
    const status = optionalString(body.status, 50) ?? "active";

    if (!isDatabaseConfigured()) {
      const site = createDemoSite({ clientId, name, address, status });
      return NextResponse.json({ id: site.id, site }, { status: 201 });
    }

    const result = await query<ResultSetHeader>(
      `
        INSERT INTO sites (client_id, name, address, status)
        VALUES (?, ?, ?, ?)
      `,
      [
        clientId,
        name,
        address,
        status,
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
