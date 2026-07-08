import type { ReactNode } from "react";
import type { SessionUser } from "@/lib/types";
import { Header } from "./Header";

export function Shell({
  user,
  title,
  subtitle,
  navItems,
  children,
}: {
  user: SessionUser;
  title: string;
  subtitle: string;
  navItems: string[];
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-sand">
      <Header user={user} />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit border border-slate-200 bg-white p-3 shadow-soft">
          <nav className="grid gap-1">
            {navItems.map((item) => (
              <button
                key={item}
                className="focus-ring rounded px-3 py-2 text-start text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {item}
              </button>
            ))}
          </nav>
        </aside>
        <section className="space-y-6">
          <div>
            <p className="text-sm font-semibold text-field">عين | AYN Security</p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal text-ink">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{subtitle}</p>
          </div>
          {children}
        </section>
      </div>
    </main>
  );
}
