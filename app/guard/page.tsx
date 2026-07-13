import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/ui/StatCard";
import { requireRole } from "@/lib/auth";

export default async function GuardPage() {
  const user = await requireRole(["guard"]);

  return (
    <AppShell
      user={user}
      title="Guard Mobile/PWA"
      subtitle="Guard experience placeholder. My Tasks, Patrol, and Report Incident are reserved for later sprints."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="My Tasks" value="Later" hint="Sprint 5 placeholder" />
        <StatCard label="Patrol" value="Later" hint="Sprint 6 placeholder" />
        <StatCard label="Report Incident" value="Later" hint="Sprint 7 placeholder" />
      </div>
    </AppShell>
  );
}
