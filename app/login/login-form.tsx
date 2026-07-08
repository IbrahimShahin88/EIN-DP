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
    error: "فشل تسجيل الدخول.",
  },
  en: {
    userLabel: "User ID",
    userPlaceholder: "Enter user ID",
    passwordLabel: "Passcode",
    passwordPlaceholder: "Enter passcode",
    submit: "Sign in",
    submitting: "Signing in...",
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
            isArabic ? "pr-12 text-right" : "pl-12 text-left"
          }`}
          dir={isArabic ? "rtl" : "ltr"}
          name="email"
          type="text"
          placeholder={text.userPlaceholder}
          autoComplete="username"
          required
        />
        <UserIcon className={`pointer-events-none absolute bottom-3 h-5 w-5 text-[var(--port-amber)] ${isArabic ? "right-4" : "left-4"}`} />
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
            isArabic ? "pr-12 text-right" : "pl-12 text-left"
          }`}
          dir={isArabic ? "rtl" : "ltr"}
          name="password"
          type="password"
          placeholder={text.passwordPlaceholder}
          autoComplete="current-password"
          required
        />
        <LockIcon className={`pointer-events-none absolute bottom-3 h-5 w-5 text-[var(--port-amber)] ${isArabic ? "right-4" : "left-4"}`} />
      </label>

      {error ? <p className="border border-red-300/40 bg-red-950/50 px-3 py-2 text-sm font-semibold text-red-100">{error}</p> : null}

      <button
        className="focus-ring mt-2 border border-[var(--port-amber)] bg-[linear-gradient(135deg,#f4c56a,#b67a24)] px-4 py-3 text-lg font-black text-[var(--port-ink)] shadow-[0_18px_35px_rgba(244,197,106,0.25)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isSubmitting}
      >
        {isSubmitting ? text.submitting : text.submit}
      </button>
    </form>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 10V8a5 5 0 0 1 10 0v2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M6 10h12v10H6V10Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 14v2.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}
