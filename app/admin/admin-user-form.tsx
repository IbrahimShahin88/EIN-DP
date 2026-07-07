"use client";

import { useState } from "react";
import type { Role } from "@/lib/types";

type AdminUser = {
  id: number;
  site_id?: number | null;
  siteId?: number | null;
  full_name?: string;
  fullName?: string;
  email: string;
  role: Role;
  status: string;
  created_at?: string;
};

const roleOptions: Array<{ value: Role; label: string }> = [
  { value: "admin", label: "Admin" },
  { value: "supervisor", label: "Supervisor" },
  { value: "guard", label: "Guard" },
  { value: "management", label: "Management" },
];

export function AdminUserForm({ initialUsers }: { initialUsers: AdminUser[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role"),
      siteId: formData.get("siteId") || null,
    };

    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await response.json()) as { user?: AdminUser; error?: string };

    setIsSubmitting(false);

    if (!response.ok || !data.user) {
      setError(data.error ?? "User creation failed.");
      return;
    }

    setUsers((current) => [data.user!, ...current].slice(0, 100));
    setMessage("User created successfully.");
    form.reset();
  }

  return (
    <section className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <form className="space-y-4 border border-slate-200 bg-white p-5 shadow-soft" onSubmit={onSubmit}>
        <div>
          <p className="text-lg font-bold text-ink">Create user</p>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Admin-only account provisioning. No public registration is exposed.
          </p>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Full name</span>
          <input
            className="focus-ring h-11 w-full rounded border border-slate-200 px-3 text-sm"
            name="fullName"
            required
            maxLength={255}
            autoComplete="name"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Email</span>
          <input
            className="focus-ring h-11 w-full rounded border border-slate-200 px-3 text-sm"
            name="email"
            type="email"
            required
            autoComplete="email"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Temporary password</span>
          <input
            className="focus-ring h-11 w-full rounded border border-slate-200 px-3 text-sm"
            name="password"
            type="password"
            minLength={10}
            required
            autoComplete="new-password"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Role</span>
            <select className="focus-ring h-11 w-full rounded border border-slate-200 px-3 text-sm" name="role" required>
              {roleOptions.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Site ID</span>
            <input
              className="focus-ring h-11 w-full rounded border border-slate-200 px-3 text-sm"
              name="siteId"
              type="number"
              min="1"
              placeholder="Optional"
            />
          </label>
        </div>

        {error ? <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p> : null}
        {message ? <p className="rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">{message}</p> : null}

        <button
          className="focus-ring w-full rounded bg-field px-4 py-3 text-sm font-bold text-white shadow-soft transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create account"}
        </button>
      </form>

      <div className="border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-lg font-bold text-ink">Recent users</p>
            <p className="mt-1 text-sm text-slate-500">Latest 100 accounts without password data.</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{users.length}</span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-[0.18em] text-slate-500">
              <tr>
                <th className="py-3 pr-3 font-bold">Name</th>
                <th className="py-3 pr-3 font-bold">Email</th>
                <th className="py-3 pr-3 font-bold">Role</th>
                <th className="py-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.length ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td className="py-3 pr-3 font-semibold text-ink">{user.fullName ?? user.full_name}</td>
                    <td className="py-3 pr-3 text-slate-600">{user.email}</td>
                    <td className="py-3 pr-3 text-slate-600">{user.role}</td>
                    <td className="py-3">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-6 text-sm text-slate-500" colSpan={4}>
                    No users found yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
