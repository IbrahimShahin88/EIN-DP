import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { optionalNumber, optionalString, requireString } from "@/lib/validators";

export async function GET() {
  const user = await requireUser();
  const params: unknown[] = [];
  let sql = `
    SELECT id, site_id, checkpoint_id, assigned_to, created_by, title, description, priority, status, due_at, created_at
    FROM tasks
  `;

  if (user.role === "guard") {
    sql += " WHERE assigned_to = ?";
    params.push(user.id);
  }

  sql += " ORDER BY created_at DESC LIMIT 100";
  const tasks = await query(sql, params);

  return NextResponse.json({ tasks });
}

export async function POST(request: Request) {
  const user = await requireUser();
  if (!["admin", "supervisor"].includes(user.role)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const siteId = optionalNumber(body.siteId) ?? user.siteId;
    const title = requireString(body.title, "title");

    if (!siteId) {
      throw new Error("siteId is required.");
    }

    const result = await query(
      `
        INSERT INTO tasks (site_id, checkpoint_id, assigned_to, created_by, title, description, priority, status, due_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)
      `,
      [
        siteId,
        optionalNumber(body.checkpointId),
        optionalNumber(body.assignedTo),
        user.id,
        title,
        optionalString(body.description),
        optionalString(body.priority, 50) ?? "normal",
        optionalString(body.dueAt, 50),
      ],
    );

    return NextResponse.json({ ok: true, result }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Task creation failed." },
      { status: 400 },
    );
  }
}
