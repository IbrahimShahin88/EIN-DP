import { NextResponse } from "next/server";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { requireUser } from "@/lib/auth";
import { isDatabaseConfigured, query } from "@/lib/db";
import { createDemoCheckin } from "@/lib/demo-store";
import { optionalNumber, optionalString, requireString } from "@/lib/validators";

type CheckpointRow = RowDataPacket & {
  id: number;
  qr_code: string;
};

type TaskRow = RowDataPacket & {
  due_at: string | null;
};

export async function POST(request: Request) {
  const user = await requireUser();
  if (!["guard", "supervisor", "admin"].includes(user.role)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const qrCode = requireString(body.qrCode, "qrCode", 255);
    const taskId = optionalNumber(body.taskId);

    if (!isDatabaseConfigured()) {
      const checkin = createDemoCheckin({
        qrCode,
        taskId,
        guardId: user.id,
        note: optionalString(body.note),
        imageUrl: optionalString(body.imageUrl),
        latitude: optionalNumber(body.latitude),
        longitude: optionalNumber(body.longitude),
      });
      if (!checkin) {
        return NextResponse.json({ error: "Checkpoint not found." }, { status: 404 });
      }

      return NextResponse.json(
        { id: checkin.id, checkpointId: checkin.checkpoint_id, isLate: checkin.is_late },
        { status: 201 },
      );
    }

    const checkpoints = await query<CheckpointRow[]>(
      `
        SELECT id, qr_code
        FROM checkpoints
        WHERE qr_code = ? AND status = 'active'
        LIMIT 1
      `,
      [qrCode],
    );
    const checkpoint = checkpoints[0];
    if (!checkpoint) {
      return NextResponse.json({ error: "Checkpoint not found." }, { status: 404 });
    }

    let isLate = false;
    if (taskId) {
      const tasks = await query<TaskRow[]>("SELECT due_at FROM tasks WHERE id = ? LIMIT 1", [taskId]);
      const dueAt = tasks[0]?.due_at ? new Date(tasks[0].due_at).getTime() : null;
      isLate = Boolean(dueAt && dueAt < Date.now());
    }

    const result = await query<ResultSetHeader>(
      `
        INSERT INTO qr_checkins (checkpoint_id, task_id, guard_id, qr_code, note, image_url, latitude, longitude, is_late)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        checkpoint.id,
        taskId,
        user.id,
        checkpoint.qr_code,
        optionalString(body.note),
        optionalString(body.imageUrl),
        optionalNumber(body.latitude),
        optionalNumber(body.longitude),
        isLate,
      ],
    );

    if (taskId) {
      await query(
        `
          INSERT INTO task_logs (task_id, user_id, action, note, image_url, latitude, longitude)
          VALUES (?, ?, 'qr.checkin', ?, ?, ?, ?)
        `,
        [
          taskId,
          user.id,
          optionalString(body.note),
          optionalString(body.imageUrl),
          optionalNumber(body.latitude),
          optionalNumber(body.longitude),
        ],
      );
      await query("UPDATE tasks SET status = 'in_progress' WHERE id = ? AND status = 'pending'", [taskId]);
    }

    return NextResponse.json({ id: result.insertId, checkpointId: checkpoint.id, isLate }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "QR check-in failed." },
      { status: 400 },
    );
  }
}
