const doctrineSteps = [
  {
    title: "ترى",
    description: "رصد المهمة أو البلاغ من الموقع أو نقطة التفتيش.",
  },
  {
    title: "تسجل",
    description: "تسجيل الوقت، المنفذ، الملاحظة، والصورة أو الدليل.",
  },
  {
    title: "تصعّد",
    description: "رفع البلاغ للمشرف أو الإدارة عند تجاوز الأولوية أو SLA.",
  },
  {
    title: "تغلق",
    description: "إغلاق المهمة بعد المراجعة بالدليل وسجل تدقيق واضح.",
  },
];

export function OperatingDoctrine() {
  return (
    <section className="border border-slate-200 bg-white p-5 shadow-soft" dir="rtl">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold text-field">فكرة التشغيل</p>
          <h2 className="mt-2 text-2xl font-black text-ink">العين ترى، تسجل، تصعّد، وتغلق المهمة بالدليل.</h2>
        </div>
        <p className="max-w-sm text-sm leading-6 text-slate-500">
          نظام مغلق يحول العمل الأمني من متابعة شفهية أو ورقية إلى متابعة حية قابلة للقياس والمراجعة.
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {doctrineSteps.map((step, index) => (
          <article key={step.title} className="border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-brass">0{index + 1}</p>
            <h3 className="mt-3 text-lg font-black text-ink">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
