import { EmptyState } from "@/components/EmptyState";
import { GuardOperationsPanel } from "@/components/GuardOperationsPanel";
import { MetricCard } from "@/components/MetricCard";
import { Shell } from "@/components/Shell";
import { requireRole } from "@/lib/auth";

export default async function GuardPage() {
  const user = await requireRole(["guard"]);

  return (
    <Shell
      user={user}
      title="Guard Field Tasks"
      subtitle="واجهة تنفيذ ميدانية بسيطة: استلام المهمة، مسح QR، رفع صورة أو ملاحظة، وإرسال البلاغ عند وجود خطر."
      navItems={["Start Shift", "Scan QR", "My Tasks", "Report Incident", "Emergency / SOS", "End Shift"]}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="My tasks" value="0" hint="Assigned tasks for this guard" />
        <MetricCard label="QR scans" value="0" hint="Checkpoint evidence trail" />
        <MetricCard label="Incidents" value="0" hint="Reports submitted today" />
      </div>
      <GuardOperationsPanel />
      <section className="grid gap-4 md:grid-cols-2">
        <EmptyState
          title="Field execution"
          description="الحارس لا يحتاج لوحة معقدة. يحتاج قائمة مهام واضحة، زر مسح QR، رفع صورة، وملاحظة قصيرة تثبت التنفيذ."
        />
        <EmptyState
          title="Evidence first"
          description="كل مهمة يجب أن تنتهي بدليل: وقت التنفيذ، نقطة التفتيش، صورة عند الحاجة، وملاحظة قابلة للمراجعة."
        />
      </section>
    </Shell>
  );
}
