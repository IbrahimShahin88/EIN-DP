export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="border border-dashed border-slate-300 bg-white p-8 text-center shadow-soft">
      <p className="text-lg font-bold text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}
