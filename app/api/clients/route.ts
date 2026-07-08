import { NextResponse } from "next/server";
import type { ResultSetHeader } from "mysql2";
import { requireUser } from "@/lib/auth";
import { isDatabaseConfigured, query } from "@/lib/db";
import { createDemoClient, getDemoStore } from "@/lib/demo-store";
import { optionalString, requireString } from "@/lib/validators";

export async function GET() {
  await requireUser();

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ clients: getDemoStore().clients });
  }

  const clients = await query(`
    SELECT id, name, status, created_at
    FROM clients
    ORDER BY created_at DESC
    LIMIT 100
  `);

  return NextResponse.json({ clients });
}

export async function POST(request: Request) {
  const user = await requireUser();
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const name = requireString(body.name, "name");
    const status = optionalString(body.status, 50) ?? "active";

    if (!isDatabaseConfigured()) {
      const client = createDemoClient(name, status);
      return NextResponse.json({ id: client.id, client }, { status: 201 });
    }

    const result = await query<ResultSetHeader>(
      `
        INSERT INTO clients (name, status)
        VALUES (?, ?)
      `,
      [name, status],
    );

    return NextResponse.json({ id: result.insertId }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Client creation failed." },
      { status: 400 },
    );
  }
}
