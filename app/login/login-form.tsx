"use client";

import { useState } from "react";
import type { LoginLanguage } from "./login-content";

const roleRedirects: Record<string, string> = {
  admin: "/admin",
  supervisor: "/supervisor",
  guard: "/guard",
  management: "/dashboard",
};

const copy = {
  ar: {
    title: "تسجيل الدخول",
    subtitle: "نظام إدارة الأمن",
    userLabel: "اسم الدخول",
    userPlaceholder: "ادخل اسم الدخول",
    passwordLabel: "كلمة المرور",
    passwordPlaceholder: "ادخل كلمة المرور",
    submit: "دخول",
    submitting: "جاري التحقق...",
    error: "بيانات الدخول غير صحيحة",
  },
  en: {
    title: "Log In",
    subtitle: "Security Management System",
    userLabel: "Login name",
    userPlaceholder: "Enter login name",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter password",
    submit: "Sign in",
    submitting: "Checking...",
    error: "Invalid login details",
  },
} satisfies Record<LoginLanguage, Record<string, string>>;

export function LoginForm({ language }: { language: LoginLanguage }) {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isArabic = language === "ar";
  const text = copy[language];

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
      <div className={isArabic ? "text-right" : "text-left"}>
        <h1 className="text-3xl font-black leading-tight text-[var(--port-ink)]">{text.title}</h1>
        <p className="mt-1 text-sm font-bold uppercase tracking-[0.18em] text-[var(--port-blue)]">
          {text.subtitle}
        </p>
      </div>

      <Field
        icon={<UserIcon className="h-5 w-5" />}
        isArabic={isArabic}
        label={text.userLabel}
        name="email"
        placeholder={text.userPlaceholder}
        type="email"
        autoComplete="email"
      />

      <Field
        icon={<LockIcon className="h-5 w-5" />}
        isArabic={isArabic}
        label={text.passwordLabel}
        name="password"
        placeholder={text.passwordPlaceholder}
        type="password"
        autoComplete="current-password"
      />

      {error ? (
        <p className="bg-red-700/12 px-3 py-2 text-sm font-bold text-red-800">
          {error}
        </p>
      ) : null}

      <button
        className="focus-ring mt-1 flex h-14 items-center justify-center gap-3 bg-[var(--port-ink)] px-4 py-3 text-base font-black text-white shadow-[0_18px_34px_rgba(6,21,39,0.25)] transition hover:bg-[var(--port-blue)] disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isSubmitting}
      >
        <span>{isSubmitting ? text.submitting : text.submit}</span>
        <ArrowIcon className={`h-5 w-5 ${isArabic ? "rotate-180" : ""}`} />
      </button>
    </form>
  );
}

type FieldProps = {
  autoComplete: string;
  icon: React.ReactNode;
  isArabic: boolean;
  label: string;
  name: string;
  placeholder: string;
  type: string;
};

function Field({ autoComplete, icon, isArabic, label, name, placeholder, type }: FieldProps) {
  return (
    <label className="block">
      <span className={`mb-2 block text-sm font-bold text-[var(--port-ink)] ${isArabic ? "text-right" : "text-left"}`}>
        {label}
      </span>
      <div className="relative">
        <input
          className={`focus-ring h-12 w-full border border-[rgba(6,21,39,0.16)] bg-white/70 px-4 text-sm font-bold text-[var(--port-ink)] outline-none placeholder:text-[rgba(6,21,39,0.42)] ${
            isArabic ? "pr-12 text-right" : "pl-12 text-left"
          }`}
          dir={isArabic ? "rtl" : "ltr"}
          name={name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
        />
        <span
          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-[var(--port-blue)] ${
            isArabic ? "right-4" : "left-4"
          }`}
        >
          {icon}
        </span>
      </div>
    </label>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="1.9" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 10V8a5 5 0 0 1 10 0v2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M6 10h12v10H6V10Z" stroke="currentColor" strokeWidth="1.9" />
      <path d="M12 14v2.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
      <path d="m13 6 6 6-6 6" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
