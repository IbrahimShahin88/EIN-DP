import { NextResponse } from "next/server";
import type { ResultSetHeader } from "mysql2";
import { requireUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { optionalString, requireEnum } from "@/lib/validators";

const approvalStatuses = ["approved", "rejected", "escalated"] as const;

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  if (!["admin", "supervisor"].includes(user.role)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const { id } = await params;
    const taskId = Number(id);
    if (!Number.isInteger(taskId)) {
      throw new Error("task id is invalid.");
    }

    const body = (await request.json()) as Record<string, unknown>;
    const status = requireEnum(body.status, "status", approvalStatuses);
    const note = optionalString(body.note);

    const result = await query<ResultSetHeader>(
      `
        UPDATE tasks
        SET status = ?
        WHERE id = ?
      `,
      [status, taskId],
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }

    await query(
      `
        INSERT INTO task_logs (task_id, user_id, action, note)
        VALUES (?, ?, ?, ?)
      `,
      [taskId, user.id, `task.${status}`, note],
    );

    return NextResponse.json({ ok: true, status });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Task approval failed." },
      { status: 400 },
    );
  }
}
