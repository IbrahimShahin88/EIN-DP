import { EmptyState } from "@/components/EmptyState";
import { MetricCard } from "@/components/MetricCard";
import { Shell } from "@/components/Shell";
import { requireRole } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await requireRole(["management"]);

  return (
    <Shell
      user={user}
      title="Management Dashboard"
      subtitle="لوحة الإدارة ستعرض مؤشرات الأداء، الالتزام بالدوريات، البلاغات المفتوحة، والمهام المتأخرة."
      navItems={["Dashboard", "Sites", "Tasks", "Incidents", "Reports", "Settings"]}
    >
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Tasks today" value="0" hint="No task data yet" />
        <MetricCard label="Completion" value="0%" hint="Patrol compliance pending" />
        <MetricCard label="Late tasks" value="0" hint="SLA tracking next" />
        <MetricCard label="Open incidents" value="0" hint="Incident API ready" />
      </div>
      <EmptyState title="Dashboard foundation is ready" description="Once task and incident data are added, this page can show live operational KPIs." />
    </Shell>
  );
}
