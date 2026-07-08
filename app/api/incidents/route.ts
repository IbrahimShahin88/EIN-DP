import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { isDatabaseConfigured, query } from "@/lib/db";
import { createDemoIncident, getDemoStore } from "@/lib/demo-store";
import { optionalNumber, optionalString, requireString } from "@/lib/validators";

export async function GET() {
  const user = await requireUser();

  if (!isDatabaseConfigured()) {
    const store = getDemoStore();
    const incidents = (user.role === "guard" ? store.incidents.filter((incident) => incident.reported_by === user.id) : store.incidents).map(
      (incident) => ({
        ...incident,
        site_name: store.sites.find((site) => site.id === incident.site_id)?.name ?? null,
        checkpoint_name: store.checkpoints.find((checkpoint) => checkpoint.id === incident.checkpoint_id)?.name ?? null,
        reported_by_name: store.users.find((demoUser) => demoUser.id === incident.reported_by)?.full_name ?? null,
      }),
    );

    return NextResponse.json({ incidents });
  }

  const params: unknown[] = [];
  let sql = `
    SELECT
      incidents.id,
      incidents.site_id,
      sites.name AS site_name,
      incidents.reported_by,
      users.full_name AS reported_by_name,
      incidents.checkpoint_id,
      checkpoints.name AS checkpoint_name,
      incidents.incident_type,
      incidents.title,
      incidents.description,
      incidents.severity,
      incidents.status,
      incidents.action_taken,
      incidents.escalation_status,
      incidents.image_url,
      incidents.created_at,
      incidents.closed_at
    FROM incidents
    LEFT JOIN sites ON sites.id = incidents.site_id
    LEFT JOIN checkpoints ON checkpoints.id = incidents.checkpoint_id
    LEFT JOIN users ON users.id = incidents.reported_by
  `;

  if (user.role === "guard") {
    sql += " WHERE reported_by = ?";
    params.push(user.id);
  }

  sql += " ORDER BY created_at DESC LIMIT 100";
  const incidents = await query(sql, params);

  return NextResponse.json({ incidents });
}

export async function POST(request: Request) {
  const user = await requireUser();

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const siteId = optionalNumber(body.siteId) ?? user.siteId;
    const title = requireString(body.title, "title");

    if (!siteId) {
      throw new Error("siteId is required.");
    }

    if (!isDatabaseConfigured()) {
      const incident = createDemoIncident({
        site_id: siteId,
        reported_by: user.id,
        checkpoint_id: optionalNumber(body.checkpointId),
        incident_type: optionalString(body.incidentType, 100) ?? "general",
        title,
        description: optionalString(body.description),
        severity: optionalString(body.severity, 50) ?? "medium",
        status: optionalString(body.status, 50) ?? "open",
        action_taken: optionalString(body.actionTaken),
        escalation_status: optionalString(body.escalationStatus, 50) ?? "none",
        image_url: optionalString(body.imageUrl),
      });

      return NextResponse.json({ ok: true, id: incident.id, incident }, { status: 201 });
    }

    const result = await query(
      `
        INSERT INTO incidents (site_id, reported_by, checkpoint_id, incident_type, title, description, severity, status, action_taken, escalation_status, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        siteId,
        user.id,
        optionalNumber(body.checkpointId),
        optionalString(body.incidentType, 100) ?? "general",
        title,
        optionalString(body.description),
        optionalString(body.severity, 50) ?? "medium",
        optionalString(body.status, 50) ?? "open",
        optionalString(body.actionTaken),
        optionalString(body.escalationStatus, 50) ?? "none",
        optionalString(body.imageUrl),
      ],
    );

    return NextResponse.json({ ok: true, result }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Incident creation failed." },
      { status: 400 },
    );
  }
}
