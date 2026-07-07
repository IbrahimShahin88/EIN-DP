import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { roleHome } from "@/lib/permissions";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) {
    redirect(roleHome[user.role]);
  }

  return (
    <main className="login-luxury relative min-h-screen overflow-hidden bg-[var(--port-ink)] text-[var(--port-ivory)]">
      <div
        className="absolute inset-0 scale-[1.03] bg-cover bg-center"
        style={{ backgroundImage: "url('/dp-world-login-bg.png')" }}
      />
      <div className="login-noise absolute inset-0" />
      <div className="login-grid absolute inset-0" />
      <div className="login-grain absolute inset-0" />

      <section className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl items-center px-5 py-8 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-12">
        <div className="max-w-2xl pb-8 pt-4 lg:-translate-y-8">
          <div className="login-reveal-mark flex items-center gap-5">
            <div className="w-56 border border-white/25 bg-white p-4 shadow-[0_24px_70px_rgba(0,0,0,0.42)]">
              <img
                src="/dp-world-logo.jpg"
                alt="DP World"
                className="h-auto w-full object-contain"
              />
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-[var(--port-gold)] via-white/30 to-transparent" />
          </div>

          <div className="login-reveal-copy mt-8">
            <p className="text-sm font-bold uppercase tracking-[0.42em] text-[var(--port-amber)]">
              Port Security Command
            </p>
            <h1 className="login-display mt-4 max-w-xl text-5xl font-black uppercase leading-[0.96] tracking-normal text-white drop-shadow-[0_18px_35px_rgba(0,0,0,0.5)] sm:text-6xl lg:text-7xl">
              Security Gate
            </h1>
            <div className="mt-6 max-w-xl border-r-2 border-[var(--port-gold)] pr-5 text-right">
              <p className="text-2xl font-bold leading-9 text-white">بوابة إدارة الأمن بالميناء</p>
              <p className="mt-3 text-sm leading-7 text-white/72">
                دخول مخصص للفرق المصرح لها بمتابعة المهام الأمنية، الدوريات، والبلاغات التشغيلية.
              </p>
            </div>
          </div>

          <div className="login-reveal-copy mt-8 flex flex-wrap gap-3 text-xs font-bold uppercase tracking-[0.22em] text-white/78">
            <span className="border border-white/18 bg-white/8 px-3 py-2 backdrop-blur">Patrol</span>
            <span className="border border-white/18 bg-white/8 px-3 py-2 backdrop-blur">Incident</span>
            <span className="border border-white/18 bg-white/8 px-3 py-2 backdrop-blur">Access Control</span>
          </div>
        </div>

        <div className="login-reveal-panel login-panel mx-auto w-full max-w-[440px] p-px shadow-[0_36px_100px_rgba(0,0,0,0.55)] lg:translate-x-8">
          <div className="relative overflow-hidden px-7 py-7 sm:px-9">
            <div className="login-scan pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/12 to-transparent" />
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.34em] text-[var(--port-amber)]">
                  Secure Access
                </p>
                <h2 className="mt-3 text-2xl font-black tracking-normal text-white">تسجيل الدخول الأمني</h2>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                  Identity verification
                </p>
              </div>
              <div className="login-pulse grid h-16 w-16 place-items-center border border-[var(--port-gold)] bg-white p-2">
                <img src="/dp-world-logo.jpg" alt="DP World" className="h-full w-full object-contain" />
              </div>
            </div>

            <div className="mt-7 h-px bg-gradient-to-r from-transparent via-[var(--port-gold)] to-transparent" />
            <LoginForm />
            <div className="mt-6 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.26em] text-white/44">
              <span>DPW-SMS</span>
              <span>Encrypted Session</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
