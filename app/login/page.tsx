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
    <main className="grid min-h-screen place-items-center bg-sand px-4 py-8">
      <section className="grid w-full max-w-5xl overflow-hidden border border-slate-200 bg-white shadow-soft lg:grid-cols-[1fr_420px]">
        <div className="bg-ink p-8 text-white sm:p-10">
          <div className="grid h-16 w-16 place-items-center rounded bg-white text-2xl font-bold text-ink">عين</div>
          <h1 className="mt-8 text-4xl font-bold tracking-normal">AYN Security Tasks</h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-slate-200">
            منصة تشغيلية لإدارة مهام الأمن، الدوريات، البلاغات، واعتمادات المشرفين. الدخول متاح فقط
            للمستخدمين الذين أنشأهم مسؤول النظام.
          </p>
          <div className="mt-10 grid gap-3 text-sm text-slate-200">
            <p>العين ترى، تسجل، تصعد، وتغلق المهمة بالدليل.</p>
            <p>Roles: Admin, Supervisor, Guard, Management</p>
          </div>
        </div>
        <div className="p-6 sm:p-8">
          <p className="text-sm font-semibold text-field">Secure login</p>
          <h2 className="mt-2 text-2xl font-bold text-ink">تسجيل الدخول</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">استخدم بريدك وكلمة المرور المخصصة من Admin.</p>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
