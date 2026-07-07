import { EmptyState } from "@/components/EmptyState";
import { MetricCard } from "@/components/MetricCard";
import { Shell } from "@/components/Shell";
import { requireRole } from "@/lib/auth";

export default async function GuardPage() {
  const user = await requireRole(["guard"]);

  return (
    <Shell
      user={user}
      title="Guard Tasks"
      subtitle="واجهة الحارس ستكون بسيطة وسريعة: بدء وردية، مسح QR، عرض المهام، وإرسال البلاغات."
      navItems={["Start Shift", "Scan QR", "My Tasks", "Report Incident", "Emergency / SOS", "End Shift"]}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="My tasks" value="0" hint="Assigned tasks will show here" />
        <MetricCard label="QR scans" value="0" hint="Checkpoint check-ins next" />
        <MetricCard label="Incidents" value="0" hint="Reports submitted today" />
      </div>
      <EmptyState title="Guard app shell is ready" description="The next sprint can connect this page to real tasks, QR check-ins, and incident reports." />
    </Shell>
  );
}
