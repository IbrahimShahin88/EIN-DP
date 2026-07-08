"use client";

import { useState } from "react";

const severities = ["low", "medium", "high", "critical"] as const;

export function GuardOperationsPanel() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>, url: string, success: string) {
    event.preventDefault();
    setMessage("");
    setError("");

    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { error?: string; id?: number; isLate?: boolean };
      if (!response.ok) {
        throw new Error(data.error ?? "Request failed.");
      }
      setMessage(data.isLate === undefined ? success : `${success} ${data.isLate ? "Late visit" : "On-time visit"}.`);
      form.reset();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Request failed.");
    }
  }

  return (
    <section className="space-y-4" dir="rtl">
      <div className="border border-slate-200 bg-white p-5 shadow-soft">
        <p className="text-sm font-bold text-field">واجهة الحارس</p>
        <h2 className="mt-2 text-2xl font-black text-ink">Scan QR + Report Incident</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          شاشة تنفيذ ميدانية مختصرة: امسح النقطة، أثبت التنفيذ، أو ارفع بلاغًا عند وجود خطر.
        </p>
      </div>

      {error ? <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-700">{error}</p> : null}
      {message ? <p className="rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">{message}</p> : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <form className="space-y-3 border border-slate-200 bg-white p-5 shadow-soft" onSubmit={(event) => submit(event, "/api/qr-checkins", "QR check-in saved.")}>
          <h3 className="font-black text-ink">QR Check-in</h3>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">QR Code</span>
            <input className="focus-ring h-11 w-full rounded border border-slate-200 px-3 text-sm" name="qrCode" placeholder="AYN-..." required />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">Task ID</span>
              <input className="focus-ring h-11 w-full rounded border border-slate-200 px-3 text-sm" name="taskId" type="number" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">Image URL</span>
              <input className="focus-ring h-11 w-full rounded border border-slate-200 px-3 text-sm" name="imageUrl" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">Latitude</span>
              <input className="focus-ring h-11 w-full rounded border border-slate-200 px-3 text-sm" name="latitude" type="number" step="any" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">Longitude</span>
              <input className="focus-ring h-11 w-full rounded border border-slate-200 px-3 text-sm" name="longitude" type="number" step="any" />
            </label>
          </div>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">Note</span>
            <textarea className="focus-ring min-h-24 w-full rounded border border-slate-200 px-3 py-2 text-sm" name="note" />
          </label>
          <button className="focus-ring w-full rounded bg-field px-4 py-3 text-sm font-bold text-white">Save Check-in</button>
        </form>

        <form className="space-y-3 border border-slate-200 bg-white p-5 shadow-soft" onSubmit={(event) => submit(event, "/api/incidents", "Incident report created.")}>
          <h3 className="font-black text-ink">Incident Report</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">Site ID</span>
              <input className="focus-ring h-11 w-full rounded border border-slate-200 px-3 text-sm" name="siteId" type="number" required />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">Checkpoint ID</span>
              <input className="focus-ring h-11 w-full rounded border border-slate-200 px-3 text-sm" name="checkpointId" type="number" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">Incident Type</span>
              <input className="focus-ring h-11 w-full rounded border border-slate-200 px-3 text-sm" name="incidentType" placeholder="unauthorized_access" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">Severity</span>
              <select className="focus-ring h-11 w-full rounded border border-slate-200 px-3 text-sm" name="severity">
                {severities.map((severity) => (
                  <option key={severity} value={severity}>{severity}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">Title</span>
            <input className="focus-ring h-11 w-full rounded border border-slate-200 px-3 text-sm" name="title" required />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">Description</span>
            <textarea className="focus-ring min-h-24 w-full rounded border border-slate-200 px-3 py-2 text-sm" name="description" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">Action taken</span>
            <textarea className="focus-ring min-h-20 w-full rounded border border-slate-200 px-3 py-2 text-sm" name="actionTaken" />
          </label>
          <button className="focus-ring w-full rounded bg-field px-4 py-3 text-sm font-bold text-white">Create Incident</button>
        </form>
      </div>
    </section>
  );
}
