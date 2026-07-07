"use client";

import { useState } from "react";
import { LoginForm } from "./login-form";

export type LoginLanguage = "ar" | "en";

export function LoginContent() {
  const [language, setLanguage] = useState<LoginLanguage>("ar");
  const isArabic = language === "ar";

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="login-luxury relative min-h-screen overflow-hidden bg-[var(--port-ink)]"
    >
      <img
        src="/dp-world-login-bg.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,15,28,0.78),rgba(3,15,28,0.14)_42%,rgba(3,15,28,0.72))]" />
      <div className="login-grain absolute inset-0" />

      <section
        className={`relative z-10 flex min-h-screen items-center px-4 py-6 sm:px-8 ${
          isArabic ? "justify-end" : "justify-start"
        }`}
      >
        <div className="login-reveal-panel w-full max-w-[430px] bg-[rgba(248,241,223,0.9)] px-7 py-7 text-[var(--port-ink)] shadow-[0_34px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:px-9">
          <div className="mb-7 flex items-start justify-between gap-4">
            <img
              src="/dp-world-logo-transparent.png"
              alt="DP World"
              className="h-auto w-44 object-contain"
            />
            <button
              type="button"
              onClick={() => setLanguage(isArabic ? "en" : "ar")}
              className="focus-ring grid h-11 w-11 place-items-center border border-[rgba(6,21,39,0.14)] bg-white/45 text-[var(--port-ink)] transition hover:border-[var(--port-gold)] hover:text-[var(--port-blue)]"
              aria-label={isArabic ? "Switch to English" : "التبديل إلى العربية"}
              title={isArabic ? "English" : "العربية"}
            >
              <GlobeIcon className="h-5 w-5" />
            </button>
          </div>

          <LoginForm language={language} />
        </div>
      </section>
    </main>
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
