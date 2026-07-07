"use client";

import { useState } from "react";
import { LoginForm } from "./login-form";

type Language = "ar" | "en";

const copy = {
  ar: {
    eyebrow: "",
    title: "نؤمن عالمنا الملئ بالنجاحات",
    description: "دخول مخصص للفرق المصرح لها بمتابعة المهام الأمنية، الدوريات، والبلاغات التشغيلية.",
    tags: [],
    switchLabel: "English",
    switchHint: "EN",
  },
  en: {
    eyebrow: "Port Security Command",
    title: "Security Gate",
    description: "Authorized access for patrols, incidents, and operational security teams.",
    tags: ["Patrol", "Incident", "Access Control"],
    switchLabel: "العربية",
    switchHint: "AR",
  },
} satisfies Record<Language, Record<string, string | string[]>>;

export function LoginContent() {
  const [language, setLanguage] = useState<Language>("ar");
  const isArabic = language === "ar";
  const text = copy[language];

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="login-luxury relative min-h-screen overflow-hidden bg-[var(--port-ink)] text-[var(--port-ivory)]"
    >
      <div
        className="absolute inset-0 scale-[1.03] bg-cover bg-center"
        style={{ backgroundImage: "url('/dp-world-login-bg.png')" }}
      />
      <div className="login-noise absolute inset-0" />
      <div className="login-grid absolute inset-0" />
      <div className="login-grain absolute inset-0" />

      <section className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl items-center px-5 py-8 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-12">
        <div className="max-w-2xl pb-8 pt-4 lg:-translate-y-8">
          <div className="login-reveal-mark flex items-start justify-between gap-5">
            <img
              src="/dp-world-logo-transparent.png"
              alt="DP World"
              className="h-auto w-56 object-contain drop-shadow-[0_6px_18px_rgba(255,255,255,0.52)]"
            />
          </div>

          <div className={`login-reveal-copy mt-10 max-w-xl ${isArabic ? "text-right" : "text-left"}`}>
            {text.eyebrow ? (
              <p className="text-sm font-bold uppercase tracking-[0.36em] text-[var(--port-amber)]">
                {text.eyebrow}
              </p>
            ) : null}
            <h1
              className={`login-display mt-4 font-black uppercase tracking-normal text-white drop-shadow-[0_18px_35px_rgba(0,0,0,0.5)] ${
                isArabic ? "text-3xl leading-[1.18] sm:text-4xl lg:text-5xl" : "text-5xl leading-[0.96] sm:text-6xl lg:text-7xl"
              }`}
            >
              {text.title}
            </h1>
            <p className="mt-6 max-w-lg text-base font-semibold leading-8 text-white/74">
              {text.description}
            </p>
          </div>

          {(text.tags as string[]).length ? (
            <div
              className={`login-reveal-copy mt-8 flex flex-wrap gap-3 text-xs font-bold ${
                isArabic ? "justify-start" : "uppercase tracking-[0.22em]"
              } text-white/78`}
            >
              {(text.tags as string[]).map((tag) => (
                <span key={tag} className="border border-white/18 bg-white/8 px-3 py-2 backdrop-blur">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="login-reveal-panel login-panel mx-auto w-full max-w-[440px] p-px shadow-[0_36px_100px_rgba(0,0,0,0.55)] lg:translate-x-8">
          <div className="relative overflow-hidden px-7 py-7 sm:px-9">
            <div className="login-scan pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/12 to-transparent" />
            <div className="mb-5 flex justify-end">
              <button
                type="button"
                onClick={() => setLanguage(isArabic ? "en" : "ar")}
                className="focus-ring flex min-w-28 items-center justify-center gap-2 border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white shadow-[0_16px_40px_rgba(0,0,0,0.28)] backdrop-blur transition hover:border-[var(--port-amber)] hover:text-[var(--port-amber)]"
                aria-label={isArabic ? "Switch to English" : "التبديل إلى العربية"}
              >
                <GlobeIcon className="h-4 w-4 text-[var(--port-amber)]" />
                <span>{text.switchLabel}</span>
                <span className="text-[var(--port-amber)]">{text.switchHint}</span>
              </button>
            </div>
            <LoginForm language={language} />
          </div>
        </div>
      </section>
    </main>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.6 9h16.8M3.6 15h16.8M12 3c2.2 2.2 3.3 5.2 3.3 9S14.2 18.8 12 21M12 3c-2.2 2.2-3.3 5.2-3.3 9s1.1 6.8 3.3 9" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}
