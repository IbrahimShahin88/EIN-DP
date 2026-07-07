import type { Role } from "./types";

export const roleHome: Record<Role, string> = {
  admin: "/admin",
  supervisor: "/supervisor",
  guard: "/guard",
  management: "/dashboard",
};

export const roleLabels: Record<Role, string> = {
  admin: "Admin",
  supervisor: "Security Supervisor",
  guard: "Security Guard",
  management: "Management",
};

export function isRole(value: string): value is Role {
  return ["admin", "supervisor", "guard", "management"].includes(value);
}
