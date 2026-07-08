import type { Role } from "./types";
import { hashPassword } from "./password";

type DemoUser = {
  id: number;
  site_id: number | null;
  full_name: string;
  email: string;
  password_hash: string;
  role: Role;
  status: string;
  created_at: string;
};

type DemoClient = {
  id: number;
  name: string;
  status: string;
  created_at: string;
};

type DemoSite = {
  id: number;
  client_id: number;
  name: string;
  address: string | null;
  status: string;
  created_at: string;
};

type DemoZone = {
  id: number;
  site_id: number;
  name: string;
  created_at: string;
};

type DemoCheckpoint = {
  id: number;
  zone_id: number;
  name: string;
  qr_code: string;
  location_note: string | null;
  status: string;
  created_at: string;
};

type DemoTask = {
  id: number;
  site_id: number;
  checkpoint_id: number | null;
  assigned_to: number | null;
  created_by: number;
  task_type: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  due_at: string | null;
  created_at: string;
};

type DemoIncident = {
  id: number;
  site_id: number;
  reported_by: number;
  checkpoint_id: number | null;
  incident_type: string;
  title: string;
  description: string | null;
  severity: string;
  status: string;
  action_taken: string | null;
  escalation_status: string;
  image_url: string | null;
  created_at: string;
  closed_at: string | null;
};

type DemoCheckin = {
  id: number;
  checkpoint_id: number;
  task_id: number | null;
  guard_id: number;
  qr_code: string;
  note: string | null;
  image_url: string | null;
  latitude: number | null;
  longitude: number | null;
  is_late: boolean;
  checked_at: string;
};

type DemoStore = {
  counters: Record<string, number>;
  users: DemoUser[];
  clients: DemoClient[];
  sites: DemoSite[];
  zones: DemoZone[];
  checkpoints: DemoCheckpoint[];
  tasks: DemoTask[];
  incidents: DemoIncident[];
  checkins: DemoCheckin[];
};

const globalStore = globalThis as typeof globalThis & {
  __aynDemoStore?: DemoStore;
};

function now() {
  return new Date().toISOString();
}

function nextId(store: DemoStore, key: string) {
  store.counters[key] = (store.counters[key] ?? 0) + 1;
  return store.counters[key];
}

export function getDemoStore() {
  globalStore.__aynDemoStore ??= {
    counters: {
      users: 1,
      clients: 0,
      sites: 0,
      zones: 0,
      checkpoints: 0,
      tasks: 0,
      incidents: 0,
      checkins: 0,
    },
    users: [
      {
        id: 1,
        site_id: null,
        full_name: "Official Admin",
        email: "admin",
        password_hash: hashPassword("123"),
        role: "admin",
        status: "active",
        created_at: now(),
      },
    ],
    clients: [],
    sites: [],
    zones: [],
    checkpoints: [],
    tasks: [],
    incidents: [],
    checkins: [],
  };

  return globalStore.__aynDemoStore;
}

export function createDemoUser(input: {
  fullName: string;
  email: string;
  password: string;
  role: Role;
  siteId: number | null;
}) {
  const store = getDemoStore();
  const existing = store.users.find((user) => user.email === input.email);
  if (existing) {
    existing.full_name = input.fullName;
    existing.password_hash = hashPassword(input.password);
    existing.role = input.role;
    existing.site_id = input.siteId;
    existing.status = "active";
    return existing;
  }

  const user = {
    id: nextId(store, "users"),
    site_id: input.siteId,
    full_name: input.fullName,
    email: input.email,
    password_hash: hashPassword(input.password),
    role: input.role,
    status: "active",
    created_at: now(),
  };
  store.users.unshift(user);
  return user;
}

export function findDemoUser(email: string) {
  return getDemoStore().users.find((user) => user.email === email && user.status === "active") ?? null;
}

export function createDemoClient(name: string, status = "active") {
  const store = getDemoStore();
  const client = { id: nextId(store, "clients"), name, status, created_at: now() };
  store.clients.unshift(client);
  return client;
}

export function createDemoSite(input: { clientId: number; name: string; address: string | null; status: string }) {
  const store = getDemoStore();
  const site = {
    id: nextId(store, "sites"),
    client_id: input.clientId,
    name: input.name,
    address: input.address,
    status: input.status,
    created_at: now(),
  };
  store.sites.unshift(site);
  return site;
}

export function createDemoZone(siteId: number, name: string) {
  const store = getDemoStore();
  const zone = { id: nextId(store, "zones"), site_id: siteId, name, created_at: now() };
  store.zones.unshift(zone);
  return zone;
}

export function createDemoCheckpoint(input: {
  zoneId: number;
  name: string;
  qrCode: string;
  locationNote: string | null;
}) {
  const store = getDemoStore();
  const checkpoint = {
    id: nextId(store, "checkpoints"),
    zone_id: input.zoneId,
    name: input.name,
    qr_code: input.qrCode,
    location_note: input.locationNote,
    status: "active",
    created_at: now(),
  };
  store.checkpoints.unshift(checkpoint);
  return checkpoint;
}

export function createDemoTask(input: {
  siteId: number;
  checkpointId: number | null;
  assignedTo: number | null;
  createdBy: number;
  taskType: string;
  title: string;
  description: string | null;
  priority: string;
  dueAt: string | null;
}) {
  const store = getDemoStore();
  const task = {
    id: nextId(store, "tasks"),
    site_id: input.siteId,
    checkpoint_id: input.checkpointId,
    assigned_to: input.assignedTo,
    created_by: input.createdBy,
    task_type: input.taskType,
    title: input.title,
    description: input.description,
    priority: input.priority,
    status: "pending",
    due_at: input.dueAt,
    created_at: now(),
  };
  store.tasks.unshift(task);
  return task;
}

export function approveDemoTask(taskId: number, status: string) {
  const task = getDemoStore().tasks.find((item) => item.id === taskId);
  if (!task) {
    return null;
  }
  task.status = status;
  return task;
}

export function createDemoCheckin(input: {
  qrCode: string;
  taskId: number | null;
  guardId: number;
  note: string | null;
  imageUrl: string | null;
  latitude: number | null;
  longitude: number | null;
}) {
  const store = getDemoStore();
  const checkpoint = store.checkpoints.find((item) => item.qr_code === input.qrCode && item.status === "active");
  if (!checkpoint) {
    return null;
  }

  const task = input.taskId ? store.tasks.find((item) => item.id === input.taskId) : null;
  const isLate = Boolean(task?.due_at && new Date(task.due_at).getTime() < Date.now());
  if (task && task.status === "pending") {
    task.status = "in_progress";
  }

  const checkin = {
    id: nextId(store, "checkins"),
    checkpoint_id: checkpoint.id,
    task_id: input.taskId,
    guard_id: input.guardId,
    qr_code: checkpoint.qr_code,
    note: input.note,
    image_url: input.imageUrl,
    latitude: input.latitude,
    longitude: input.longitude,
    is_late: isLate,
    checked_at: now(),
  };
  store.checkins.unshift(checkin);
  return checkin;
}

export function createDemoIncident(input: Omit<DemoIncident, "id" | "created_at" | "closed_at">) {
  const store = getDemoStore();
  const incident = {
    ...input,
    id: nextId(store, "incidents"),
    created_at: now(),
    closed_at: null,
  };
  store.incidents.unshift(incident);
  return incident;
}

export function getDemoDashboardSummary() {
  const store = getDemoStore();
  const today = new Date().toISOString().slice(0, 10);
  const tasksToday = store.tasks.filter((task) => task.created_at.slice(0, 10) === today).length;
  const completedTasks = store.tasks.filter((task) => task.status === "approved").length;
  const lateTasks = store.tasks.filter(
    (task) => task.due_at && new Date(task.due_at).getTime() < Date.now() && !["approved", "rejected"].includes(task.status),
  ).length;
  const lateCheckins = store.checkins.filter((checkin) => checkin.is_late).length;

  return {
    tasks: {
      tasks_today: tasksToday,
      total_tasks: store.tasks.length,
      completed_tasks: completedTasks,
      late_tasks: lateTasks,
      completion_rate: store.tasks.length ? Math.round((completedTasks / store.tasks.length) * 100) : 0,
    },
    incidents: {
      open_incidents: store.incidents.filter((incident) => incident.status === "open").length,
    },
    guardPerformance: store.users
      .filter((user) => user.role === "guard")
      .map((user) => ({
        guard_id: user.id,
        guard_name: user.full_name,
        assigned_tasks: store.tasks.filter((task) => task.assigned_to === user.id).length,
        approved_tasks: store.tasks.filter((task) => task.assigned_to === user.id && task.status === "approved").length,
      })),
    checkpointProblems: store.checkpoints.map((checkpoint) => ({
      checkpoint_id: checkpoint.id,
      checkpoint_name: checkpoint.name,
      incident_count: store.incidents.filter((incident) => incident.checkpoint_id === checkpoint.id).length,
    })),
    incidentsBySeverity: ["low", "medium", "high", "critical"].map((severity) => ({
      severity,
      total: store.incidents.filter((incident) => incident.severity === severity).length,
    })),
    patrolCompliance: {
      total_checkins: store.checkins.length,
      late_checkins: lateCheckins,
      compliance_rate: store.checkins.length ? 100 - Math.round((lateCheckins / store.checkins.length) * 100) : 0,
    },
  };
}
