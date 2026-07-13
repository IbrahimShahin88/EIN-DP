import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/ui/StatCard";
import { requireRole } from "@/lib/auth";

export default async function SupervisorPage() {
  const user = await requireRole(["supervisor"]);

  return (
    <AppShell
      user={user}
      title="Supervisor Console"
      subtitle="Sprint 1 protected placeholder. Live tasks, patrol, and incident workflows arrive in later sprints."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Live tasks" value="Later" hint="Sprint 5 placeholder" />
        <StatCard label="Patrol" value="Later" hint="Sprint 6 placeholder" />
        <StatCard label="Incidents" value="Later" hint="Sprint 7 placeholder" />
      </div>
    </AppShell>
  );
}
