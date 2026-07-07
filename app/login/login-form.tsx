"use client";

import { useState } from "react";

const roleRedirects: Record<string, string> = {
  admin: "/admin",
  supervisor: "/supervisor",
  guard: "/guard",
  management: "/dashboard",
};

export function LoginForm() {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    const payload = (await response.json()) as { role?: string; error?: string };
    setIsSubmitting(false);

    if (!response.ok || !payload.role) {
      setError(payload.error ?? "فشل تسجيل الدخول.");
      return;
    }

    window.location.assign(roleRedirects[payload.role] ?? "/");
  }

  return (
    <form className="mt-5 grid gap-4" onSubmit={onSubmit}>
      <label className="relative block">
        <span className="sr-only">اسم المستخدم</span>
        <input
          className="focus-ring h-11 w-full rounded-md border border-slate-300 bg-white px-4 pr-11 text-right text-sm font-medium text-[#0b2540] shadow-inner placeholder:text-slate-500"
          dir="rtl"
          name="email"
          type="email"
          placeholder="اسم المستخدم"
          autoComplete="email"
          required
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">▧</span>
      </label>

      <label className="relative block">
        <span className="sr-only">كلمة المرور</span>
        <input
          className="focus-ring h-11 w-full rounded-md border border-slate-300 bg-white px-4 pr-11 text-right text-sm font-medium text-[#0b2540] shadow-inner placeholder:text-slate-500"
          dir="rtl"
          name="password"
          type="password"
          placeholder="كلمة المرور"
          autoComplete="current-password"
          required
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">▣</span>
      </label>

      {error ? <p className="rounded bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p> : null}

      <button
        className="focus-ring rounded-lg border-2 border-[#8ad1ff] bg-[#075fb8] px-4 py-3 text-xl font-black text-white shadow-[0_0_0_3px_rgba(7,95,184,0.35),0_10px_24px_rgba(7,95,184,0.28)] transition hover:bg-[#064f9a] disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isSubmitting}
      >
        {isSubmitting ? "جاري الدخول..." : "تسجيل الدخول"}
      </button>

      <div className="mt-1 flex items-center justify-between gap-4 text-sm font-medium text-[#0b2540]">
        <div className="flex items-center gap-2 text-left" dir="ltr">
          <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#0b2540] text-xs font-black">
            ✓
          </span>
          <span className="text-[10px] font-black leading-3">
            SECURE
            <br />
            LOGIN
          </span>
          <span className="text-2xl">▣</span>
        </div>
        <div className="grid gap-2 text-right">
          <a className="hover:underline" href="#">
            نسيت كلمة المرور؟
          </a>
          <a className="hover:underline" href="#">
            تسجيل مستخدم جديد
          </a>
        </div>
      </div>
    </form>
  );
}
