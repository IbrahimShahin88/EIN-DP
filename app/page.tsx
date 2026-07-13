import { ActionButton } from "@/components/ui/ActionButton";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.2),transparent_34rem),linear-gradient(135deg,#020617,#0f172a_55%,#111827)] text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
        <p className="text-sm font-black uppercase tracking-[0.32em] text-cyan-300">Ein / عين</p>
        <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-normal md:text-7xl">
          See. Control. Prove.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          Ein transforms security operations from paper, WhatsApp, and verbal follow-up into real-time control,
          digital proof, executive reporting, and audit-ready operations.
        </p>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-400" dir="rtl">
          راقب. سيطر. أثبت. منصة تجارية مغلقة للتشغيل الأمني متعدد المستأجرين.
        </p>
        <div className="mt-8">
          <ActionButton href="/login">Go to login</ActionButton>
        </div>
      </section>
    </main>
  );
}
