"use client";

import { useState } from "react";
import type { LoginLanguage } from "./login-content";

const roleRedirects: Record<string, string> = {
  admin: "/admin",
  supervisor: "/supervisor",
  guard: "/guard",
  management: "/dashboard",
};

const formCopy = {
  ar: {
    userLabel: "اسم الدخول",
    userPlaceholder: "اكتب اسم الدخول",
    passwordLabel: "كلمة المرور",
    passwordPlaceholder: "اكتب كلمة المرور",
    submit: "دخول",
    submitting: "جاري الدخول...",
    language: "English",
    error: "بيانات الدخول غير صحيحة",
  },
  en: {
    userLabel: "Login name",
    userPlaceholder: "Enter login name",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter password",
    submit: "Sign in",
    submitting: "Signing in...",
    language: "العربية",
    error: "Invalid login details",
  },
} satisfies Record<LoginLanguage, Record<string, string>>;

type LoginFormProps = {
  language: LoginLanguage;
  onToggleLanguage: () => void;
};

export function LoginForm({ language, onToggleLanguage }: LoginFormProps) {
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

    const payload = (await response.json()) as { role?: string };
    setIsSubmitting(false);

    if (!response.ok || !payload.role) {
      setError(text.error);
      return;
    }

    window.location.assign(roleRedirects[payload.role] ?? "/");
  }

  return (
    <form className="grid gap-5" onSubmit={onSubmit}>
      <label className="block">
        <span className={`mb-2 block text-sm font-bold text-white/86 ${isArabic ? "text-right" : "text-left"}`}>
          {text.userLabel}
        </span>
        <div className="relative">
          <input
            className={`focus-ring h-12 w-full border border-white/16 bg-white/10 px-4 text-sm font-semibold text-white shadow-[inset_0_1px_18px_rgba(255,255,255,0.04)] outline-none backdrop-blur placeholder:text-white/42 ${
              isArabic ? "pr-12 text-right" : "pl-12 text-left"
            }`}
            dir={isArabic ? "rtl" : "ltr"}
            name="email"
            type="email"
            placeholder={text.userPlaceholder}
            autoComplete="email"
            required
          />
          <UserIcon className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--port-amber)] ${isArabic ? "right-4" : "left-4"}`} />
        </div>
      </label>

      <label className="block">
        <span className={`mb-2 block text-sm font-bold text-white/86 ${isArabic ? "text-right" : "text-left"}`}>
          {text.passwordLabel}
        </span>
        <div className="relative">
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
          <LockIcon className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--port-amber)] ${isArabic ? "right-4" : "left-4"}`} />
        </div>
      </label>

      {error ? (
        <p className="border border-red-300/40 bg-red-950/50 px-3 py-2 text-sm font-semibold text-red-100">
          {error}
        </p>
      ) : null}

      <button
        className="focus-ring mt-1 flex h-14 items-center justify-center gap-3 border border-[var(--port-amber)] bg-[linear-gradient(135deg,#f4c56a,#b67a24)] px-4 text-lg font-black text-[var(--port-ink)] shadow-[0_18px_35px_rgba(244,197,106,0.25)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isSubmitting}
      >
        <span>{isSubmitting ? text.submitting : text.submit}</span>
        <ArrowIcon className={`h-5 w-5 ${isArabic ? "rotate-180" : ""}`} />
      </button>

      <button
        type="button"
        onClick={onToggleLanguage}
        className="focus-ring flex h-11 items-center justify-center gap-2 border border-white/16 bg-white/8 px-4 text-sm font-bold text-white/86 backdrop-blur transition hover:border-[var(--port-amber)] hover:text-[var(--port-amber)]"
      >
        <GlobeIcon className="h-4 w-4" />
        <span>{text.language}</span>
      </button>
    </form>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 10V8a5 5 0 0 1 10 0v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6 10h12v10H6V10Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 14v2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="m13 6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.6 9h16.8M3.6 15h16.8M12 3c2.2 2.2 3.3 5.2 3.3 9S14.2 18.8 12 21M12 3c-2.2 2.2-3.3 5.2-3.3 9s1.1 6.8 3.3 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
