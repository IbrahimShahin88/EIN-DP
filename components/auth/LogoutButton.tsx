"use client";

import { useState } from "react";

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <button
      className="rounded-md border border-white/10 px-3 py-2 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
      disabled={isLoading}
      onClick={handleLogout}
      type="button"
    >
      {isLoading ? "Signing out..." : "Logout"}
    </button>
  );
}
