import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#020617,#0f172a,#111827)] px-6 text-white">
      <section className="max-w-lg rounded-2xl border border-white/10 bg-white/[0.06] p-8 text-center shadow-[0_30px_100px_rgba(0,0,0,0.4)]">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-300">Unauthorized</p>
        <h1 className="mt-4 text-3xl font-black">Access denied</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Your current role is not allowed to access this Ein workspace.
        </p>
        <Link className="mt-6 inline-flex rounded-md bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950" href="/login">
          Back to login
        </Link>
      </section>
    </main>
  );
}
