import type { SessionUser } from "@/lib/types";
import { roleLabels } from "@/lib/permissions";
import { Logo } from "./Logo";

export function Header({ user }: { user: SessionUser }) {
  return (
    <header className="border-b border-slate-200 bg-white/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Logo />
        <div className="flex items-center gap-3 text-left" dir="ltr">
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-ink">{user.fullName}</p>
            <p className="text-xs text-slate-500">{roleLabels[user.role]}</p>
          </div>
          <form action="/api/auth/logout" method="post">
            <button className="focus-ring rounded border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Logout
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
