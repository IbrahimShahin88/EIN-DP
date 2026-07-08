import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { taskTypes } from "@/lib/types";
import { optionalEnum, optionalNumber, optionalString, requireString } from "@/lib/validators";

export async function GET() {
  const user = await requireUser();
  const params: unknown[] = [];
  let sql = `
    SELECT
      tasks.id,
      tasks.site_id,
      sites.name AS site_name,
      tasks.checkpoint_id,
      checkpoints.name AS checkpoint_name,
      tasks.assigned_to,
      users.full_name AS assigned_to_name,
      tasks.created_by,
      tasks.task_type,
      tasks.title,
      tasks.description,
      tasks.priority,
      tasks.status,
      tasks.due_at,
      tasks.created_at
    FROM tasks
    LEFT JOIN sites ON sites.id = tasks.site_id
    LEFT JOIN checkpoints ON checkpoints.id = tasks.checkpoint_id
    LEFT JOIN users ON users.id = tasks.assigned_to
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
    const taskType = optionalEnum(body.taskType, taskTypes, "patrol");

    if (!siteId) {
      throw new Error("siteId is required.");
    }

    const result = await query(
      `
        INSERT INTO tasks (site_id, checkpoint_id, assigned_to, created_by, task_type, title, description, priority, status, due_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
      `,
      [
        siteId,
        optionalNumber(body.checkpointId),
        optionalNumber(body.assignedTo),
        user.id,
        taskType,
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
