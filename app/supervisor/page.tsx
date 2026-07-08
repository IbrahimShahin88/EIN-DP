import { EmptyState } from "@/components/EmptyState";
import { MetricCard } from "@/components/MetricCard";
import { OperatingDoctrine } from "@/components/OperatingDoctrine";
import { Shell } from "@/components/Shell";
import { requireRole } from "@/lib/auth";

export default async function SupervisorPage() {
  const user = await requireRole(["supervisor"]);

  return (
    <Shell
      user={user}
      title="Security Supervisor Workspace"
      subtitle="توزيع المهام، متابعة الدوريات، مراجعة البلاغات، والتصعيد عند الحاجة قبل أن تتحول المشكلة إلى خطر تشغيلي."
      navItems={["Live Tasks", "Assign Task", "Patrol Status", "Incidents", "Approvals", "Daily Report"]}
    >
      <OperatingDoctrine />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Live tasks" value="0" hint="Tasks waiting for assignment or follow-up" />
        <MetricCard label="Pending approvals" value="0" hint="Guard submissions awaiting review" />
        <MetricCard label="Open incidents" value="0" hint="Reports requiring supervisor action" />
      </div>
      <EmptyState
        title="Supervisor flow"
        description="المشرف يرى حالة الدوريات والمهام الحية، يوزع التكليفات، يراجع الأدلة، ويصعد البلاغات للإدارة عند تجاوز الأولوية أو SLA."
      />
    </Shell>
  );
}
