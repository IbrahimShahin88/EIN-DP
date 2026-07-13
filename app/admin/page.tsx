import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/ui/StatCard";
import { requireRole } from "@/lib/auth";

export default async function AdminPage() {
  const user = await requireRole(["super_admin"]);

  return (
    <AppShell
      user={user}
      title="Welcome to Ein Admin"
      subtitle="Super-admin foundation for tenant and user setup. Plans and subscriptions are intentionally placeholders for later sprints."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard label="Tenants" value="Sprint 1" hint="Tenant list and creation API are available for super_admin." />
        <StatCard label="Users" value="Sprint 1" hint="User list and creation API are available for super_admin." />
      </div>
      <section className="grid gap-4 md:grid-cols-4">
        {["Tenants", "Users", "Plans later", "Subscriptions later"].map((item) => (
          <div key={item} className="rounded-xl border border-white/10 bg-white/[0.06] p-5 text-sm font-bold text-slate-200">
            {item}
          </div>
        ))}
      </section>
    </AppShell>
  );
}
