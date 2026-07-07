"use client";

import { useState } from "react";

type Language = "ar" | "en";

const roleRedirects: Record<string, string> = {
  admin: "/admin",
  supervisor: "/supervisor",
  guard: "/guard",
  management: "/dashboard",
};

const formCopy = {
  ar: {
    userLabel: "اسم المستخدم",
    userPlaceholder: "اكتب اسم المستخدم",
    passwordLabel: "كلمة المرور",
    passwordPlaceholder: "اكتب كلمة المرور",
    submit: "تسجيل الدخول",
    submitting: "جاري الدخول...",
    secure: "دخول آمن",
    forgot: "نسيت كلمة المرور؟",
    register: "تسجيل مستخدم جديد",
    error: "فشل تسجيل الدخول.",
  },
  en: {
    userLabel: "User ID",
    userPlaceholder: "Enter user ID",
    passwordLabel: "Passcode",
    passwordPlaceholder: "Enter passcode",
    submit: "Sign in",
    submitting: "Signing in...",
    secure: "Secure login",
    forgot: "Forgot passcode?",
    register: "Register new user",
    error: "Login failed.",
  },
} satisfies Record<Language, Record<string, string>>;

export function LoginForm({ language }: { language: Language }) {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isArabic = language === "ar";
  const text = formCopy[language];

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
      setError(payload.error ?? text.error);
      return;
    }

    window.location.assign(roleRedirects[payload.role] ?? "/");
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <label className="relative block">
        <span
          className={`mb-2 block text-sm font-bold text-white/86 ${
            isArabic ? "text-right" : "text-left uppercase tracking-[0.18em]"
          }`}
        >
          {text.userLabel}
        </span>
        <input
          className={`focus-ring h-12 w-full border border-white/16 bg-white/10 px-4 text-sm font-semibold text-white shadow-[inset_0_1px_18px_rgba(255,255,255,0.04)] outline-none backdrop-blur placeholder:text-white/42 ${
            isArabic ? "pr-11 text-right" : "pl-11 text-left"
          }`}
          dir={isArabic ? "rtl" : "ltr"}
          name="email"
          type="email"
          placeholder={text.userPlaceholder}
          autoComplete="email"
          required
        />
        <span
          className={`pointer-events-none absolute bottom-3 text-[10px] font-black text-[var(--port-amber)] ${
            isArabic ? "right-3" : "left-3"
          }`}
        >
          ID
        </span>
      </label>

      <label className="relative block">
        <span
          className={`mb-2 block text-sm font-bold text-white/86 ${
            isArabic ? "text-right" : "text-left uppercase tracking-[0.18em]"
          }`}
        >
          {text.passwordLabel}
        </span>
        <input
          className={`focus-ring h-12 w-full border border-white/16 bg-white/10 px-4 text-sm font-semibold text-white shadow-[inset_0_1px_18px_rgba(255,255,255,0.04)] outline-none backdrop-blur placeholder:text-white/42 ${
            isArabic ? "pr-11 text-right" : "pl-11 text-left"
          }`}
          dir={isArabic ? "rtl" : "ltr"}
          name="password"
          type="password"
          placeholder={text.passwordPlaceholder}
          autoComplete="current-password"
          required
        />
        <span
          className={`pointer-events-none absolute bottom-3 text-[10px] font-black text-[var(--port-amber)] ${
            isArabic ? "right-3" : "left-3"
          }`}
        >
          PW
        </span>
      </label>

      {error ? <p className="border border-red-300/40 bg-red-950/50 px-3 py-2 text-sm font-semibold text-red-100">{error}</p> : null}

      <button
        className="focus-ring mt-2 border border-[var(--port-amber)] bg-[linear-gradient(135deg,#f4c56a,#b67a24)] px-4 py-3 text-lg font-black text-[var(--port-ink)] shadow-[0_18px_35px_rgba(244,197,106,0.25)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isSubmitting}
      >
        {isSubmitting ? text.submitting : text.submit}
      </button>

      <div className={`mt-2 grid gap-4 border-t border-white/10 pt-4 ${isArabic ? "text-right" : "text-left"}`}>
        <div className={`flex items-center gap-2 ${isArabic ? "justify-end" : "justify-start"}`}>
          <span className="grid h-8 w-8 place-items-center rounded-full border border-[var(--port-amber)] text-[10px] font-black text-[var(--port-amber)]">
            OK
          </span>
          <span className="text-[10px] font-black uppercase leading-3 tracking-[0.18em] text-white/60">
            {text.secure}
          </span>
        </div>
        <div className="grid gap-2 text-xs font-medium text-white/72">
          <a className="hover:text-[var(--port-amber)]" href="#">
            {text.forgot}
          </a>
          <a className="hover:text-[var(--port-amber)]" href="#">
            {text.register}
          </a>
        </div>
      </div>
    </form>
  );
}
