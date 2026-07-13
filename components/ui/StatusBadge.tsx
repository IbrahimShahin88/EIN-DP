export function StatusBadge({ status }: { status: string }) {
  const palette = status === "active" || status === "trial" ? "bg-emerald-400/15 text-emerald-200 ring-emerald-300/20" : "bg-amber-400/15 text-amber-200 ring-amber-300/20";

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${palette}`}>
      {status}
    </span>
  );
}
