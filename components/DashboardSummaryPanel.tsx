"use client";

import { useEffect, useState } from "react";
import { MetricCard } from "./MetricCard";

type Summary = {
  tasks?: {
    tasks_today?: number;
    completion_rate?: number;
    late_tasks?: number;
  };
  incidents?: {
    open_incidents?: number;
  };
  patrolCompliance?: {
    compliance_rate?: number;
  };
};

export function DashboardSummaryPanel() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetch("/api/dashboard/summary")
      .then(async (response) => {
        const data = (await response.json()) as { summary?: Summary; error?: string };
        if (!response.ok) {
          throw new Error(data.error ?? "Dashboard summary failed.");
        }
        if (active) {
          setSummary(data.summary ?? {});
        }
      })
      .catch((caught) => {
        if (active) {
          setError(caught instanceof Error ? caught.message : "Dashboard summary failed.");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return (
      <div className="border border-amber-200 bg-amber-50 p-5 text-sm font-bold text-amber-800 shadow-soft">
        Live dashboard waits for database connection: {error}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-5">
      <MetricCard label="Tasks today" value={String(summary?.tasks?.tasks_today ?? 0)} hint="Operational workload" />
      <MetricCard label="Completion" value={`${summary?.tasks?.completion_rate ?? 0}%`} hint="Task approval rate" />
      <MetricCard label="Late tasks" value={String(summary?.tasks?.late_tasks ?? 0)} hint="SLA pressure" />
      <MetricCard label="Open incidents" value={String(summary?.incidents?.open_incidents ?? 0)} hint="Active reports" />
      <MetricCard label="Patrol compliance" value={`${summary?.patrolCompliance?.compliance_rate ?? 0}%`} hint="QR on-time visits" />
    </div>
  );
}
