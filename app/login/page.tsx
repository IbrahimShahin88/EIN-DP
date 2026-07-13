import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { getCurrentUser } from "@/lib/auth";
import { getRoleRedirectPath } from "@/lib/roles";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect(getRoleRedirectPath(user.role));
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.18),transparent_28rem),linear-gradient(135deg,#020617,#0f172a_58%,#111827)] text-white">
      <section className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-6 py-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.32em] text-cyan-300">Ein / عين</p>
          <h1 className="mt-5 text-5xl font-black tracking-normal md:text-6xl">See. Control. Prove.</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
            Commercial SaaS authentication for audit-ready security operations. Sprint 0 and Sprint 1 only.
          </p>
          <p className="mt-3 max-w-xl text-base leading-7 text-slate-400" dir="rtl">
            دخول مغلق للمستخدمين المصرح لهم فقط. لا يوجد تسجيل عام.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-7 shadow-[0_30px_100px_rgba(0,0,0,0.38)] backdrop-blur">
          <div className="mb-6">
            <p className="text-sm font-bold text-cyan-300">Secure login</p>
            <h2 className="mt-2 text-2xl font-black text-white">Enter Ein Command</h2>
          </div>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
