export const roles = ["admin", "supervisor", "guard", "management"] as const;

export type Role = (typeof roles)[number];

export type SessionUser = {
  id: number;
  fullName: string;
  email: string;
  role: Role;
  siteId: number | null;
};

export type TaskStatus =
  | "pending"
  | "in_progress"
  | "submitted"
  | "approved"
  | "rejected"
  | "escalated";

export const taskTypes = [
  "patrol",
  "fixed_post",
  "incident",
  "checklist",
  "escort",
  "urgent",
] as const;

export type TaskType = (typeof taskTypes)[number];

export type IncidentSeverity = "low" | "medium" | "high" | "critical";
