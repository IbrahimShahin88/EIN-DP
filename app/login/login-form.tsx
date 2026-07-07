"use client";

import { useState } from "react";

const roleRedirects: Record<string, string> = {
  admin: "/admin",
  supervisor: "/supervisor",
  guard: "/guard",
  management: "/dashboard",
};

export function LoginForm() {
  const [hasError, setHasError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasError(false);
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
      setHasError(true);
      return;
    }

    window.location.assign(roleRedirects[payload.role] ?? "/");
  }

  return (
    <form className="grid gap-5" onSubmit={onSubmit}>
      <label className="relative block">
        <span className="sr-only">User ID</span>
        <input
          className="focus-ring h-12 w-full border border-white/16 bg-white/10 px-4 pl-12 text-left text-sm font-semibold text-white shadow-[inset_0_1px_18px_rgba(255,255,255,0.04)] outline-none backdrop-blur"
          dir="ltr"
          name="email"
          type="email"
          autoComplete="email"
          aria-label="User ID"
          required
        />
        <span className="pointer-events-none absolute left-4 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-[var(--port-amber)] shadow-[0_0_16px_rgba(244,197,106,0.8)]" />
      </label>

      <label className="relative block">
        <span className="sr-only">Passcode</span>
        <input
          className="focus-ring h-12 w-full border border-white/16 bg-white/10 px-4 pl-12 text-left text-sm font-semibold text-white shadow-[inset_0_1px_18px_rgba(255,255,255,0.04)] outline-none backdrop-blur"
          dir="ltr"
          name="password"
          type="password"
          autoComplete="current-password"
          aria-label="Passcode"
          required
        />
        <span className="pointer-events-none absolute left-4 top-1/2 h-3 w-3 -translate-y-1/2 border-2 border-[var(--port-amber)] shadow-[0_0_16px_rgba(244,197,106,0.45)]" />
      </label>

      {hasError ? <div className="h-1 w-full bg-red-400/80" aria-hidden="true" /> : null}

      <button
        className="focus-ring mt-1 grid h-14 place-items-center border border-[var(--port-amber)] bg-[linear-gradient(135deg,#f4c56a,#b67a24)] text-[var(--port-ink)] shadow-[0_18px_35px_rgba(244,197,106,0.25)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isSubmitting}
        aria-label="Sign in"
      >
        <span
          className={`block h-4 w-4 rotate-45 border-r-4 border-t-4 border-[var(--port-ink)] ${
            isSubmitting ? "animate-pulse" : ""
          }`}
          aria-hidden="true"
        />
      </button>
    </form>
  );
}
