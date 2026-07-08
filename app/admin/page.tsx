import type { RowDataPacket } from "mysql2";
import { CoreFunctions } from "@/components/CoreFunctions";
import { MetricCard } from "@/components/MetricCard";
import { OperatingDoctrine } from "@/components/OperatingDoctrine";
import { RoleMatrix } from "@/components/RoleMatrix";
import { Shell } from "@/components/Shell";
import { requireRole } from "@/lib/auth";
import { query } from "@/lib/db";
import { AdminUserForm } from "./admin-user-form";

type CountRow = RowDataPacket & {
  total: number;
};

type AdminUserRow = RowDataPacket & {
  id: number;
  site_id: number | null;
  full_name: string;
  email: string;
  role: "admin" | "supervisor" | "guard" | "management";
  status: string;
  created_at: string;
};

async function loadAdminOverview() {
  try {
    const [sites, users, checkpoints, recentUsers] = await Promise.all([
      query<CountRow[]>("SELECT COUNT(*) AS total FROM sites WHERE status = 'active'"),
      query<CountRow[]>("SELECT COUNT(*) AS total FROM users WHERE status = 'active'"),
      query<CountRow[]>("SELECT COUNT(*) AS total FROM checkpoints WHERE status = 'active'"),
      query<AdminUserRow[]>(`
        SELECT id, site_id, full_name, email, role, status, created_at
        FROM users
        ORDER BY created_at DESC
        LIMIT 100
      `),
    ]);

    return {
      activeSites: sites[0]?.total ?? 0,
      activeUsers: users[0]?.total ?? 0,
      activeCheckpoints: checkpoints[0]?.total ?? 0,
      recentUsers: recentUsers.map((user) => ({
        id: user.id,
        site_id: user.site_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        status: user.status,
        created_at: String(user.created_at),
      })),
    };
  } catch {
    return {
      activeSites: 0,
      activeUsers: 0,
      activeCheckpoints: 0,
      recentUsers: [],
    };
  }
}

export default async function AdminPage() {
  const user = await requireRole(["admin"]);
  const overview = await loadAdminOverview();

  return (
    <Shell
      user={user}
      title="Admin Command Center"
      subtitle="تأسيس المواقع، المستخدمين، نقاط التفتيش، والصلاحيات. لا يوجد تسجيل عام لأن عين نظام أمني مغلق."
      navItems={["Overview", "Sites", "Users", "Zones", "Checkpoints", "Permissions"]}
    >
      <OperatingDoctrine />
      <RoleMatrix />
      <CoreFunctions />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Active sites" value={String(overview.activeSites)} hint="Operational locations" />
        <MetricCard label="Users" value={String(overview.activeUsers)} hint="Created by Admin only" />
        <MetricCard label="Checkpoints" value={String(overview.activeCheckpoints)} hint="QR patrol points" />
      </div>
      <AdminUserForm initialUsers={overview.recentUsers} />
    </Shell>
  );
}
