"use client";

import { useState } from "react";

type ApiResult = {
  id?: number;
  qrCode?: string;
  error?: string;
};

async function postJson(url: string, payload: Record<string, FormDataEntryValue | null>) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await response.json()) as ApiResult;

  if (!response.ok) {
    throw new Error(data.error ?? "Request failed.");
  }

  return data;
}

function Field({ label, name, type = "text", placeholder, required = true }: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">{label}</span>
      <input
        className="focus-ring h-11 w-full rounded border border-slate-200 px-3 text-sm"
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
}

export function SecurityStructurePanel() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>, url: string) {
    event.preventDefault();
    setMessage("");
    setError("");

    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const result = await postJson(url, payload);
      setMessage(result.qrCode ? `Saved. QR Code: ${result.qrCode}` : `Saved. ID: ${result.id ?? "created"}`);
      form.reset();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Request failed.");
    }
  }

  return (
    <section className="space-y-4" dir="rtl">
      <div className="border border-slate-200 bg-white p-5 shadow-soft">
        <p className="text-sm font-bold text-field">إدارة المواقع الأمنية</p>
        <h2 className="mt-2 text-2xl font-black text-ink">Client &gt; Site &gt; Zone &gt; Checkpoint</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          أنشئ الهيكل التشغيلي من العميل حتى نقطة التفتيش. كل Checkpoint يحصل على QR Code خاص به.
        </p>
      </div>

      {error ? <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-700">{error}</p> : null}
      {message ? <p className="rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">{message}</p> : null}

      <div className="grid gap-4 lg:grid-cols-4">
        <form className="space-y-3 border border-slate-200 bg-white p-4 shadow-soft" onSubmit={(event) => submit(event, "/api/clients")}>
          <h3 className="font-black text-ink">Client</h3>
          <Field label="اسم العميل" name="name" placeholder="شركة / مول" />
          <button className="focus-ring w-full rounded bg-field px-4 py-2 text-sm font-bold text-white">Create Client</button>
        </form>

        <form className="space-y-3 border border-slate-200 bg-white p-4 shadow-soft" onSubmit={(event) => submit(event, "/api/sites")}>
          <h3 className="font-black text-ink">Site</h3>
          <Field label="Client ID" name="clientId" type="number" placeholder="1" />
          <Field label="اسم الموقع" name="name" placeholder="20 West Mall" />
          <Field label="العنوان" name="address" placeholder="Optional" required={false} />
          <button className="focus-ring w-full rounded bg-field px-4 py-2 text-sm font-bold text-white">Create Site</button>
        </form>

        <form className="space-y-3 border border-slate-200 bg-white p-4 shadow-soft" onSubmit={(event) => submit(event, "/api/zones")}>
          <h3 className="font-black text-ink">Zone</h3>
          <Field label="Site ID" name="siteId" type="number" placeholder="1" />
          <Field label="اسم المنطقة" name="name" placeholder="Parking Zone" />
          <button className="focus-ring w-full rounded bg-field px-4 py-2 text-sm font-bold text-white">Create Zone</button>
        </form>

        <form className="space-y-3 border border-slate-200 bg-white p-4 shadow-soft" onSubmit={(event) => submit(event, "/api/checkpoints")}>
          <h3 className="font-black text-ink">Checkpoint</h3>
          <Field label="Zone ID" name="zoneId" type="number" placeholder="1" />
          <Field label="اسم النقطة" name="name" placeholder="Gate 01 / Fire Exit" />
          <Field label="QR Code" name="qrCode" placeholder="اتركه فارغًا للتوليد" required={false} />
          <Field label="ملاحظة المكان" name="locationNote" placeholder="Optional" required={false} />
          <button className="focus-ring w-full rounded bg-field px-4 py-2 text-sm font-bold text-white">Create Checkpoint</button>
        </form>
      </div>
    </section>
  );
}
