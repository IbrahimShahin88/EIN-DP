"use client";

import { useState } from "react";

const taskTypes = [
  ["patrol", "Patrol Task"],
  ["fixed_post", "Fixed Post Task"],
  ["incident", "Incident Task"],
  ["checklist", "Checklist Task"],
  ["escort", "Escort Task"],
  ["urgent", "Urgent Task"],
] as const;

const approvalStatuses = [
  ["approved", "Approved"],
  ["rejected", "Rejected"],
  ["escalated", "Escalated"],
] as const;

export function TaskOperationsPanel() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function createTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Task creation failed.");
      }
      setMessage("Task created and moved to Pending.");
      form.reset();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Task creation failed.");
    }
  }

  async function approveTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const taskId = String(formData.get("taskId") ?? "").trim();
    const payload = {
      status: formData.get("status"),
      note: formData.get("note"),
    };

    try {
      const response = await fetch(`/api/tasks/${taskId}/approval`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { error?: string; status?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Approval failed.");
      }
      setMessage(`Task ${taskId} marked as ${data.status}.`);
      form.reset();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Approval failed.");
    }
  }

  return (
    <section className="space-y-4" dir="rtl">
      <div className="border border-slate-200 bg-white p-5 shadow-soft">
        <p className="text-sm font-bold text-field">المهام الأمنية</p>
        <h2 className="mt-2 text-2xl font-black text-ink">Create Task + Supervisor Approval</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          المهمة تبدأ Pending، تتحرك إلى In Progress عند التنفيذ، ثم Submitted، وبعد مراجعة المشرف تتحول إلى Approved أو Rejected أو Escalated.
        </p>
      </div>

      {error ? <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-700">{error}</p> : null}
      {message ? <p className="rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">{message}</p> : null}

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <form className="grid gap-3 border border-slate-200 bg-white p-5 shadow-soft sm:grid-cols-2" onSubmit={createTask}>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">Task Type</span>
            <select className="focus-ring h-11 w-full rounded border border-slate-200 px-3 text-sm" name="taskType">
              {taskTypes.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">Title</span>
            <input className="focus-ring h-11 w-full rounded border border-slate-200 px-3 text-sm" name="title" required />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">Site ID</span>
            <input className="focus-ring h-11 w-full rounded border border-slate-200 px-3 text-sm" name="siteId" type="number" required />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">Checkpoint ID</span>
            <input className="focus-ring h-11 w-full rounded border border-slate-200 px-3 text-sm" name="checkpointId" type="number" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">Assigned Guard ID</span>
            <input className="focus-ring h-11 w-full rounded border border-slate-200 px-3 text-sm" name="assignedTo" type="number" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">Due at</span>
            <input className="focus-ring h-11 w-full rounded border border-slate-200 px-3 text-sm" name="dueAt" type="datetime-local" />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-bold text-slate-700">Description</span>
            <textarea className="focus-ring min-h-24 w-full rounded border border-slate-200 px-3 py-2 text-sm" name="description" />
          </label>
          <button className="focus-ring rounded bg-field px-4 py-3 text-sm font-bold text-white sm:col-span-2">Create Task</button>
        </form>

        <form className="space-y-3 border border-slate-200 bg-white p-5 shadow-soft" onSubmit={approveTask}>
          <h3 className="font-black text-ink">Supervisor Approval</h3>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">Task ID</span>
            <input className="focus-ring h-11 w-full rounded border border-slate-200 px-3 text-sm" name="taskId" type="number" required />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">Decision</span>
            <select className="focus-ring h-11 w-full rounded border border-slate-200 px-3 text-sm" name="status">
              {approvalStatuses.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">Review note</span>
            <textarea className="focus-ring min-h-24 w-full rounded border border-slate-200 px-3 py-2 text-sm" name="note" />
          </label>
          <button className="focus-ring w-full rounded bg-field px-4 py-3 text-sm font-bold text-white">Submit Decision</button>
        </form>
      </div>
    </section>
  );
}
