import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";
import { requireUser } from "@/lib/auth";
import { isDatabaseConfigured, query } from "@/lib/db";
import { getDemoDashboardSummary } from "@/lib/demo-store";

type TaskSummaryRow = RowDataPacket & {
  tasks_today: number;
  total_tasks: number;
  completed_tasks: number | null;
  late_tasks: number | null;
};

type IncidentSummaryRow = RowDataPacket & {
  open_incidents: number;
};

type GuardPerformanceRow = RowDataPacket & {
  guard_id: number;
  guard_name: string;
  assigned_tasks: number;
  approved_tasks: number | null;
};

type CheckpointProblemRow = RowDataPacket & {
  checkpoint_id: number;
  checkpoint_name: string;
  incident_count: number;
};

type SeverityRow = RowDataPacket & {
  severity: string;
  total: number;
};

type PatrolComplianceRow = RowDataPacket & {
  total_checkins: number;
  late_checkins: number | null;
};

function percent(part: number | null | undefined, total: number | null | undefined) {
  if (!part || !total) {
    return 0;
  }

  return Math.round((part / total) * 100);
}

export async function GET() {
  await requireUser();

  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ summary: getDemoDashboardSummary(), mode: "demo" });
    }

    const [taskRows, incidentRows, guardPerformance, checkpointProblems, severityRows, patrolRows] =
      await Promise.all([
        query<TaskSummaryRow[]>(`
          SELECT
            SUM(DATE(created_at) = CURRENT_DATE()) AS tasks_today,
            COUNT(*) AS total_tasks,
            SUM(status = 'approved') AS completed_tasks,
            SUM(due_at IS NOT NULL AND due_at < NOW() AND status NOT IN ('approved', 'rejected')) AS late_tasks
          FROM tasks
        `),
        query<IncidentSummaryRow[]>(`
          SELECT COUNT(*) AS open_incidents
          FROM incidents
          WHERE status = 'open'
        `),
        query<GuardPerformanceRow[]>(`
          SELECT
            users.id AS guard_id,
            users.full_name AS guard_name,
            COUNT(tasks.id) AS assigned_tasks,
            SUM(tasks.status = 'approved') AS approved_tasks
          FROM users
          LEFT JOIN tasks ON tasks.assigned_to = users.id
          WHERE users.role = 'guard'
          GROUP BY users.id, users.full_name
          ORDER BY assigned_tasks DESC
          LIMIT 10
        `),
        query<CheckpointProblemRow[]>(`
          SELECT
            checkpoints.id AS checkpoint_id,
            checkpoints.name AS checkpoint_name,
            COUNT(incidents.id) AS incident_count
          FROM checkpoints
          LEFT JOIN incidents ON incidents.checkpoint_id = checkpoints.id
          GROUP BY checkpoints.id, checkpoints.name
          ORDER BY incident_count DESC
          LIMIT 10
        `),
        query<SeverityRow[]>(`
          SELECT severity, COUNT(*) AS total
          FROM incidents
          GROUP BY severity
        `),
        query<PatrolComplianceRow[]>(`
          SELECT
            COUNT(*) AS total_checkins,
            SUM(is_late = TRUE) AS late_checkins
          FROM qr_checkins
        `),
      ]);

    const tasks = taskRows[0] ?? {
      tasks_today: 0,
      total_tasks: 0,
      completed_tasks: 0,
      late_tasks: 0,
    };
    const patrol = patrolRows[0] ?? { total_checkins: 0, late_checkins: 0 };

    return NextResponse.json({
      summary: {
        tasks: {
          ...tasks,
          completion_rate: percent(tasks.completed_tasks, tasks.total_tasks),
        },
        incidents: incidentRows[0] ?? { open_incidents: 0 },
        guardPerformance,
        checkpointProblems,
        incidentsBySeverity: severityRows,
        patrolCompliance: {
          total_checkins: patrol.total_checkins,
          late_checkins: patrol.late_checkins ?? 0,
          compliance_rate: patrol.total_checkins ? 100 - percent(patrol.late_checkins, patrol.total_checkins) : 0,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Dashboard summary failed." },
      { status: 400 },
    );
  }
}
