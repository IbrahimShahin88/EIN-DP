import { EmptyState } from "@/components/EmptyState";
import { MetricCard } from "@/components/MetricCard";
import { RoleMatrix } from "@/components/RoleMatrix";
import { Shell } from "@/components/Shell";
import { requireRole } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await requireRole(["management"]);

  return (
    <Shell
      user={user}
      title="Management Dashboard"
      subtitle="لوحة قيادة للإدارة تتابع الأداء، الالتزام بالدوريات، البلاغات المفتوحة، SLA، والتصعيدات عبر المواقع."
      navItems={["Dashboard", "Sites", "Tasks", "Incidents", "SLA", "Reports"]}
    >
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Tasks today" value="0" hint="Operational workload" />
        <MetricCard label="Completion" value="0%" hint="Patrol and task compliance" />
        <MetricCard label="SLA breaches" value="0" hint="Late or escalated work" />
        <MetricCard label="Open incidents" value="0" hint="Active security reports" />
      </div>
      <RoleMatrix />
      <EmptyState
        title="Management view"
        description="الإدارة لا تنفذ المهام اليومية، لكنها ترى الحقيقة التشغيلية: من تأخر، أين حدث التصعيد، وما الدليل الذي أغلق المهمة."
      />
    </Shell>
  );
}
