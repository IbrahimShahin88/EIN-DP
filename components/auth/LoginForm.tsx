"use client";

import { useState } from "react";

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

    const payload = (await response.json()) as { redirectPath?: string; error?: string };
    setIsSubmitting(false);

    if (!response.ok || !payload.redirectPath) {
      setError(payload.error ?? "Login failed.");
      return;
    }

    window.location.assign(payload.redirectPath);
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <label className="block">
        <span className="mb-2 block text-sm font-bold text-slate-200">Email</span>
        <input
          className="h-12 w-full rounded-lg border border-white/10 bg-slate-950/70 px-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="superadmin@ein.app"
          required
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-bold text-slate-200">Password</span>
        <input
          className="h-12 w-full rounded-lg border border-white/10 bg-slate-950/70 px-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Ein@123456"
          required
        />
      </label>
      {error ? (
        <p className="rounded-lg border border-red-300/20 bg-red-500/10 px-3 py-2 text-sm font-bold text-red-100">
          {error}
        </p>
      ) : null}
      <button
        className="w-full rounded-lg bg-cyan-400 px-4 py-3 text-sm font-black text-slate-950 shadow-[0_0_34px_rgba(34,211,238,0.28)] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Signing in..." : "Login"}
      </button>
    </form>
  );
}
