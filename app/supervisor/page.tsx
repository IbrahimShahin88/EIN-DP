import { EmptyState } from "@/components/EmptyState";
import { MetricCard } from "@/components/MetricCard";
import { Shell } from "@/components/Shell";
import { requireRole } from "@/lib/auth";

export default async function SupervisorPage() {
  const user = await requireRole(["supervisor"]);

  return (
    <Shell
      user={user}
      title="Supervisor Workspace"
      subtitle="مساحة المشرف لمتابعة المهام والبلاغات والاعتمادات. تم تجهيزها كأساس فارغ للمرحلة التالية."
      navItems={["Live Tasks", "Assign Task", "Patrol Status", "Incidents", "Approvals", "Daily Report"]}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Live tasks" value="0" hint="No active tasks yet" />
        <MetricCard label="Pending approvals" value="0" hint="Submitted tasks appear here" />
        <MetricCard label="Open incidents" value="0" hint="Incident workflow next" />
      </div>
      <EmptyState title="Supervisor flow is ready" description="Task approval, urgent task assignment, and incident follow-up will be built after foundation." />
    </Shell>
  );
}
