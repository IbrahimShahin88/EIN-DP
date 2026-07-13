import type { Role } from "@prisma/client";
import { roleLabels } from "@/lib/roles";

export function RoleBadge({ role }: { role: Role }) {
  return (
    <span className="inline-flex rounded-full bg-cyan-400/15 px-2.5 py-1 text-xs font-bold text-cyan-100 ring-1 ring-cyan-300/20">
      {roleLabels[role]}
    </span>
  );
}
