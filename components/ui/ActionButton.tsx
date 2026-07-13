import Link from "next/link";
import type { ReactNode } from "react";

export function ActionButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-md bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.28)] transition hover:bg-cyan-300"
    >
      {children}
    </Link>
  );
}
