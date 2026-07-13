import type { Role } from "@prisma/client";

export const roleLabels: Record<Role, string> = {
  super_admin: "Super Admin",
  tenant_admin: "Tenant Admin",
  security_manager: "Security Manager",
  supervisor: "Supervisor",
  gate_officer: "Gate Officer",
  guard: "Guard",
  viewer: "Viewer",
};

export const roleRedirects: Record<Role, string> = {
  super_admin: "/admin",
  tenant_admin: "/dashboard",
  security_manager: "/dashboard",
  supervisor: "/supervisor",
  gate_officer: "/gate",
  guard: "/guard",
  viewer: "/dashboard",
};

export function getRoleRedirectPath(role: Role) {
  return roleRedirects[role];
}
