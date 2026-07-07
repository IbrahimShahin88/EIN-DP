import { EmptyState } from "@/components/EmptyState";
import { MetricCard } from "@/components/MetricCard";
import { Shell } from "@/components/Shell";
import { requireRole } from "@/lib/auth";

export default async function AdminPage() {
  const user = await requireRole(["admin"]);

  return (
    <Shell
      user={user}
      title="Admin Console"
      subtitle="إعداد العملاء والمواقع والمستخدمين سيبدأ في Sprint 2. هذه الصفحة تؤكد نجاح الدخول حسب الدور."
      navItems={["Dashboard", "Sites", "Users", "Tasks", "Incidents", "Settings"]}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Active sites" value="0" hint="Ready for Admin Setup" />
        <MetricCard label="Users" value="0" hint="Created by Admin only" />
        <MetricCard label="Checkpoints" value="0" hint="QR patrol setup next" />
      </div>
      <EmptyState title="Admin setup is ready" description="Next sprint will add Client, Site, Zone, Checkpoint, and User creation flows." />
    </Shell>
  );
}
