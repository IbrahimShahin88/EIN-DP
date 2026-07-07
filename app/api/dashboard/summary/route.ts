import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";
import { requireUser } from "@/lib/auth";
import { query } from "@/lib/db";

type TaskSummaryRow = RowDataPacket & {
  total_tasks: number;
  completed_tasks: number | null;
  late_tasks: number | null;
};

type IncidentSummaryRow = RowDataPacket & {
  open_incidents: number;
};

export async function GET() {
  await requireUser();

  const taskRows = await query<TaskSummaryRow[]>(`
    SELECT
      COUNT(*) AS total_tasks,
      SUM(status = 'approved') AS completed_tasks,
      SUM(due_at IS NOT NULL AND due_at < NOW() AND status NOT IN ('approved', 'rejected')) AS late_tasks
    FROM tasks
  `);
  const incidentRows = await query<IncidentSummaryRow[]>(`
    SELECT COUNT(*) AS open_incidents
    FROM incidents
    WHERE status = 'open'
  `);

  return NextResponse.json({
    summary: {
      tasks: taskRows[0] ?? { total_tasks: 0, completed_tasks: 0, late_tasks: 0 },
      incidents: incidentRows[0] ?? { open_incidents: 0 },
    },
  });
}
