const roles = [
  {
    role: "Admin",
    function: "إنشاء المواقع، المستخدمين، نقاط التفتيش، والصلاحيات.",
  },
  {
    role: "Security Supervisor",
    function: "توزيع المهام، متابعة الدوريات، ومراجعة البلاغات.",
  },
  {
    role: "Security Guard",
    function: "تنفيذ المهام، مسح QR، رفع الصور، وتسجيل الملاحظات.",
  },
  {
    role: "Management",
    function: "متابعة المؤشرات، التقارير، SLA، والتصعيدات.",
  },
];

export function RoleMatrix() {
  return (
    <section className="border border-slate-200 bg-white p-5 shadow-soft" dir="rtl">
      <div>
        <p className="text-sm font-bold text-field">الأدوار الأساسية</p>
        <h2 className="mt-2 text-2xl font-black text-ink">نظام أمني مغلق، كل دور يعرف حدوده ومسؤولياته.</h2>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[620px] text-right text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              <th className="py-3 pl-4">الدور</th>
              <th className="py-3">وظيفته</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {roles.map((item) => (
              <tr key={item.role}>
                <td className="py-4 pl-4 font-black text-ink" dir="ltr">
                  {item.role}
                </td>
                <td className="py-4 leading-6 text-slate-600">{item.function}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
