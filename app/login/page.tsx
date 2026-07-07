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
    <main className="relative min-h-screen overflow-hidden bg-[#071f36] text-[#0b2540]">
      <div
        className="absolute inset-x-0 top-[70px] bottom-8 bg-cover bg-center"
        style={{ backgroundImage: "url('/dp-world-login-bg.png')" }}
      />
      <div className="absolute inset-x-0 top-[70px] bottom-8 bg-[#061b31]/35" />

      <header className="relative z-10 flex h-[70px] items-center justify-between bg-white px-6 shadow-sm sm:px-10">
        <div className="flex items-center gap-3 text-right">
          <div className="h-9 border-r border-slate-300 pr-4 text-xl font-semibold text-[#0b2540]">إدارة الأمن</div>
        </div>
        <div className="flex items-center gap-3 text-left" dir="ltr">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-[#08385c] text-sm font-black text-white">
            dp
          </div>
          <div>
            <p className="text-lg font-black leading-5 text-[#0b2540]">موانئ دبي العالمية</p>
            <p className="text-base font-black leading-5 text-[#0b2540]">DP WORLD</p>
          </div>
        </div>
      </header>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-102px)] w-full max-w-7xl flex-col px-5 py-8 sm:px-8 lg:px-12">
        <div className="flex flex-1 flex-col gap-8 lg:grid lg:grid-cols-[1fr_430px_1fr] lg:items-start">
          <div className="pt-2 text-white lg:pt-8">
            <div className="flex items-center gap-5">
              <div className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-[#f5b42d] via-[#f5b42d] to-[#0877a5] text-3xl font-black text-white shadow-xl ring-4 ring-white/25">
                dp
              </div>
              <div>
                <h1 className="text-5xl font-black tracking-normal drop-shadow sm:text-6xl">DP WORLD</h1>
                <p className="mt-1 text-xl font-medium uppercase tracking-normal text-white/95">
                  Security Management System
                </p>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-2 w-full max-w-[430px] overflow-hidden rounded-lg shadow-[0_28px_80px_rgba(2,12,27,0.35)] ring-1 ring-white/35 lg:mt-24">
            <div className="bg-[#082c4d] px-6 py-5 text-center text-white">
              <h2 className="text-2xl font-black tracking-normal">تسجيل الدخول للنظام الأمني</h2>
              <p className="mt-1 text-sm font-medium uppercase tracking-normal text-white/90">
                Log in to security system
              </p>
            </div>

            <div className="bg-white/90 px-9 py-6 backdrop-blur-md">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border-4 border-[#0b2540] text-3xl font-bold text-[#0b2540]">
                ⌾
              </div>
              <LoginForm />
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 flex h-8 items-center justify-between bg-white px-6 text-xs text-[#0b2540] sm:px-8">
        <div className="flex items-center gap-3" dir="ltr">
          <span>English</span>
          <span className="h-4 w-px bg-slate-300" />
          <span>Terms</span>
          <span className="h-4 w-px bg-slate-300" />
          <span>Privacy password</span>
        </div>
        <p>© 2026 موانئ دبي العالمية. جميع الحقوق محفوظة.</p>
      </footer>
    </main>
  );
}
