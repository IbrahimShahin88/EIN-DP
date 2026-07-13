import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/ui/StatCard";
import { requireRole } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await requireRole(["tenant_admin", "security_manager", "viewer"]);

  return (
    <AppShell
      user={user}
      title="Welcome to Ein Command Center"
      subtitle="Tenant command-center placeholder. Operational modules are planned for later sprints and are not implemented yet."
    >
      <div className="grid gap-4 md:grid-cols-5">
        <StatCard label="Security Control Score" value="--" hint="Sprint 4 placeholder" />
        <StatCard label="Gate Movements" value="--" hint="Sprint 3 placeholder" />
        <StatCard label="Tasks" value="--" hint="Sprint 5 placeholder" />
        <StatCard label="Patrol" value="--" hint="Sprint 6 placeholder" />
        <StatCard label="Incidents" value="--" hint="Sprint 7 placeholder" />
      </div>
    </AppShell>
  );
}
