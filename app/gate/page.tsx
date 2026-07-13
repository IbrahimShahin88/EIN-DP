import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/ui/StatCard";
import { requireRole } from "@/lib/auth";

export default async function GatePage() {
  const user = await requireRole(["gate_officer"]);

  return (
    <AppShell
      user={user}
      title="Ein Gate"
      subtitle="Gate operations placeholder. Visitor entry, vehicle entry, and movement logs are reserved for Sprint 3."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Visitor Entry" value="Later" hint="Sprint 3 placeholder" />
        <StatCard label="Vehicle Entry" value="Later" hint="Sprint 3 placeholder" />
        <StatCard label="Movement Log" value="Later" hint="Sprint 3 placeholder" />
      </div>
    </AppShell>
  );
}
