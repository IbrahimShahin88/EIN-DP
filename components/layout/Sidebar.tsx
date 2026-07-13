import type { Role } from "@prisma/client";

const roleNav: Record<Role, string[]> = {
  super_admin: ["Admin", "Tenants", "Users", "Plans later", "Subscriptions later"],
  tenant_admin: ["Command Center", "Security Score", "Modules later"],
  security_manager: ["Command Center", "KPIs", "Modules later"],
  supervisor: ["Supervisor Console", "Live Tasks later", "Patrol later", "Incidents later"],
  gate_officer: ["Ein Gate", "Visitor Entry later", "Vehicle Entry later", "Movement Log later"],
  guard: ["Guard PWA", "My Tasks later", "Patrol later", "Report Incident later"],
  viewer: ["Command Center", "Read-only KPIs", "Reports later"],
};

export function Sidebar({ role }: { role: Role }) {
  return (
    <aside className="rounded-xl border border-white/10 bg-slate-950/70 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.3)]">
      <div className="px-3 py-3">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">Ein</p>
        <p className="mt-1 text-sm font-semibold text-slate-400">See. Control. Prove.</p>
      </div>
      <nav className="mt-2 grid gap-1">
        {roleNav[role].map((item) => (
          <button
            key={item}
            className="rounded-lg px-3 py-2 text-start text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            {item}
          </button>
        ))}
      </nav>
    </aside>
  );
}
