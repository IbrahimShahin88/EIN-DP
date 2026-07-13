import { RoleBadge } from "@/components/ui/RoleBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { CurrentUser } from "@/lib/auth";

export function DashboardHeader({
  user,
  title,
  subtitle,
}: {
  user: CurrentUser;
  title: string;
  subtitle: string;
}) {
  return (
    <header className="rounded-xl border border-white/10 bg-white/[0.06] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-bold text-cyan-300">Ein / عين</p>
          <h1 className="mt-2 text-3xl font-black tracking-normal text-white">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">{subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          <RoleBadge role={user.role} />
          {user.tenant ? <StatusBadge status={user.tenant.status} /> : null}
        </div>
      </div>
    </header>
  );
}
