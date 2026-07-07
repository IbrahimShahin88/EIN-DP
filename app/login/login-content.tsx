"use client";

import { useState } from "react";
import { LoginForm } from "./login-form";

export type LoginLanguage = "ar" | "en";

const pageCopy = {
  ar: {
    imageAlt: "ميناء دي بي ورلد",
    panelTitle: "تسجيل الدخول",
  },
  en: {
    imageAlt: "DP World port",
    panelTitle: "Login",
  },
} satisfies Record<LoginLanguage, Record<string, string>>;

export function LoginContent() {
  const [language, setLanguage] = useState<LoginLanguage>("ar");
  const isArabic = language === "ar";
  const text = pageCopy[language];

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="login-luxury min-h-screen overflow-hidden bg-[var(--port-ink)] text-[var(--port-ivory)]"
    >
      <section
        className={`grid min-h-screen ${
          isArabic ? "lg:grid-cols-[0.88fr_1.12fr]" : "lg:grid-cols-[1.12fr_0.88fr]"
        }`}
      >
        <div
          className={`relative min-h-[46vh] overflow-hidden bg-[var(--port-ink)] lg:min-h-screen ${
            isArabic ? "lg:order-2" : "lg:order-1"
          }`}
        >
          <img
            src="/dp-world-login-bg.png"
            alt={text.imageAlt}
            className="h-full w-full object-contain object-center"
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(255,255,255,0.08),transparent_36rem)]" />
        </div>

        <div
          className={`relative grid min-h-[54vh] place-items-center overflow-hidden px-5 py-8 sm:px-8 lg:min-h-screen ${
            isArabic ? "lg:order-1" : "lg:order-2"
          }`}
        >
          <div className="login-noise absolute inset-0" />
          <div className="login-grid absolute inset-0" />
          <div className="login-grain absolute inset-0" />

          <div className="login-reveal-panel login-panel relative z-10 w-full max-w-[440px] p-px shadow-[0_36px_100px_rgba(0,0,0,0.55)]">
            <div className="relative overflow-hidden px-7 py-7 sm:px-9">
              <div className="login-scan pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/12 to-transparent" />

              <div className="mb-7 grid justify-items-center gap-4">
                <img
                  src="/dp-world-logo-transparent.png"
                  alt="DP World"
                  className="h-auto w-48 object-contain drop-shadow-[0_8px_18px_rgba(255,255,255,0.48)]"
                />
                <h1 className="text-2xl font-black text-white">{text.panelTitle}</h1>
              </div>

              <LoginForm
                language={language}
                onToggleLanguage={() => setLanguage(isArabic ? "en" : "ar")}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
