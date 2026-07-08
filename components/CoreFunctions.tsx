const functionGroups = [
  {
    title: "إدارة المواقع الأمنية",
    description: "Client -> Site -> Zone -> Checkpoint مع QR Code لكل نقطة.",
    items: ["Client", "Site", "Zone", "Checkpoint", "QR Code"],
  },
  {
    title: "المهام الأمنية",
    description: "أنواع تشغيلية قابلة للتكليف والمتابعة والاعتماد.",
    items: ["Patrol", "Fixed Post", "Incident", "Checklist", "Escort", "Urgent"],
  },
  {
    title: "QR Patrol",
    description: "تسجيل الحارس، النقطة، الوقت، GPS، الصورة، الملاحظة، وحالة التأخير.",
    items: ["Guard", "Checkpoint", "Time", "GPS", "Evidence", "Late flag"],
  },
  {
    title: "البلاغات والحوادث",
    description: "بلاغات بدرجات خطورة وإجراء وتصعيد وحالة إغلاق.",
    items: ["Type", "Severity", "Location", "Images", "Action", "Closure"],
  },
];

const mvpItems = [
  "Login",
  "Users & Roles",
  "Sites / Zones / Checkpoints",
  "Create Task",
  "Guard Task List",
  "QR Check-in",
  "Incident Report",
  "Supervisor Approval",
  "Basic Dashboard",
];

export function CoreFunctions() {
  return (
    <section className="space-y-5" dir="rtl">
      <div className="border border-slate-200 bg-white p-5 shadow-soft">
        <p className="text-sm font-bold text-field">الوظائف الأساسية</p>
        <h2 className="mt-2 text-2xl font-black text-ink">MVP V1 قوي وبسيط قبل أي إضافات متقدمة.</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          نبدأ بنظام تشغيل أمني مغلق يثبت المهام والبلاغات والدوريات بالدليل. الذكاء الاصطناعي، الخرائط، Face
          Recognition، Walkie Talkie، وتطبيقات Native تنتقل إلى V2.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {functionGroups.map((group) => (
          <article key={group.title} className="border border-slate-200 bg-white p-5 shadow-soft">
            <h3 className="text-lg font-black text-ink">{group.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">{group.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                  {item}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="border border-slate-200 bg-white p-5 shadow-soft">
        <p className="text-sm font-bold text-field">MVP V1</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {mvpItems.map((item) => (
            <div key={item} className="border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold text-ink" dir="ltr">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
