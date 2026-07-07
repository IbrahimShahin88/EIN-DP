import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { optionalNumber, optionalString, requireString } from "@/lib/validators";

export async function GET() {
  const user = await requireUser();
  const params: unknown[] = [];
  let sql = `
    SELECT id, site_id, reported_by, checkpoint_id, title, description, severity, status, action_taken, created_at, closed_at
    FROM incidents
  `;

  if (user.role === "guard") {
    sql += " WHERE reported_by = ?";
    params.push(user.id);
  }

  sql += " ORDER BY created_at DESC LIMIT 100";
  const incidents = await query(sql, params);

  return NextResponse.json({ incidents });
}

export async function POST(request: Request) {
  const user = await requireUser();

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const siteId = optionalNumber(body.siteId) ?? user.siteId;
    const title = requireString(body.title, "title");

    if (!siteId) {
      throw new Error("siteId is required.");
    }

    const result = await query(
      `
        INSERT INTO incidents (site_id, reported_by, checkpoint_id, title, description, severity, status, action_taken)
        VALUES (?, ?, ?, ?, ?, ?, 'open', ?)
      `,
      [
        siteId,
        user.id,
        optionalNumber(body.checkpointId),
        title,
        optionalString(body.description),
        optionalString(body.severity, 50) ?? "medium",
        optionalString(body.actionTaken),
      ],
    );

    return NextResponse.json({ ok: true, result }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Incident creation failed." },
      { status: 400 },
    );
  }
}
