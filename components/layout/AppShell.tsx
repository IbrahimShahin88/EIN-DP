import type { ReactNode } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { Sidebar } from "./Sidebar";
import { LogoutButton } from "@/components/auth/LogoutButton";
import type { CurrentUser } from "@/lib/auth";

export function AppShell({
  user,
  title,
  subtitle,
  children,
}: {
  user: CurrentUser;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_34rem),linear-gradient(135deg,#020617,#0f172a_55%,#111827)] text-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[250px_1fr]">
        <Sidebar role={user.role} />
        <section className="space-y-6">
          <div className="flex justify-end">
            <LogoutButton />
          </div>
          <DashboardHeader user={user} title={title} subtitle={subtitle} />
          {children}
        </section>
      </div>
    </main>
  );
}
