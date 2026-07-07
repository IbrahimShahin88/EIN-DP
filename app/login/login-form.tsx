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
    <form className="mt-7 grid gap-4" onSubmit={onSubmit}>
      <label className="relative block">
        <span className="mb-2 grid gap-1">
          <span dir="ltr" className="block text-xs font-bold uppercase tracking-[0.18em] text-white/54">
            User ID
          </span>
          <span dir="rtl" className="block text-right text-sm font-bold text-white/86">
            اسم المستخدم
          </span>
        </span>
        <input
          className="focus-ring h-12 w-full border border-white/16 bg-white/10 px-4 pr-11 text-right text-sm font-semibold text-white shadow-[inset_0_1px_18px_rgba(255,255,255,0.04)] outline-none backdrop-blur placeholder:text-white/42"
          dir="rtl"
          name="email"
          type="email"
          placeholder="اكتب اسم المستخدم"
          autoComplete="email"
          required
        />
        <span className="pointer-events-none absolute bottom-3 right-3 text-[10px] font-black text-[var(--port-amber)]">ID</span>
      </label>

      <label className="relative block">
        <span className="mb-2 grid gap-1">
          <span dir="ltr" className="block text-xs font-bold uppercase tracking-[0.18em] text-white/54">
            Passcode
          </span>
          <span dir="rtl" className="block text-right text-sm font-bold text-white/86">
            كلمة المرور
          </span>
        </span>
        <input
          className="focus-ring h-12 w-full border border-white/16 bg-white/10 px-4 pr-11 text-right text-sm font-semibold text-white shadow-[inset_0_1px_18px_rgba(255,255,255,0.04)] outline-none backdrop-blur placeholder:text-white/42"
          dir="rtl"
          name="password"
          type="password"
          placeholder="اكتب كلمة المرور"
          autoComplete="current-password"
          required
        />
        <span className="pointer-events-none absolute bottom-3 right-3 text-[10px] font-black text-[var(--port-amber)]">PW</span>
      </label>

      {error ? <p className="border border-red-300/40 bg-red-950/50 px-3 py-2 text-sm font-semibold text-red-100">{error}</p> : null}

      <button
        className="focus-ring mt-2 border border-[var(--port-amber)] bg-[linear-gradient(135deg,#f4c56a,#b67a24)] px-4 py-3 text-lg font-black text-[var(--port-ink)] shadow-[0_18px_35px_rgba(244,197,106,0.25)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isSubmitting}
      >
        <span dir="rtl" className="block">
          {isSubmitting ? "جاري الدخول..." : "تسجيل الدخول"}
        </span>
        <span dir="ltr" className="mt-1 block text-[10px] font-black uppercase tracking-[0.28em] opacity-70">
          Sign in
        </span>
      </button>

      <div className="mt-2 grid gap-4 border-t border-white/10 pt-4">
        <div className="flex items-center gap-2 text-left" dir="ltr">
          <span className="grid h-8 w-8 place-items-center rounded-full border border-[var(--port-amber)] text-[10px] font-black text-[var(--port-amber)]">
            OK
          </span>
          <span className="text-[10px] font-black uppercase leading-3 tracking-[0.18em] text-white/60">
            Secure
            <br />
            Login
          </span>
        </div>
        <div dir="rtl" className="grid gap-2 text-right text-xs font-medium text-white/72">
          <a className="hover:text-[var(--port-amber)]" href="#">
            نسيت كلمة المرور؟
          </a>
          <a className="hover:text-[var(--port-amber)]" href="#">
            تسجيل مستخدم جديد
          </a>
        </div>
      </div>
    </form>
  );
}
