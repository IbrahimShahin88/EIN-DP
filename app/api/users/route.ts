import { NextResponse } from "next/server";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { requireRole } from "@/lib/auth";
import { query } from "@/lib/db";
import { isRole } from "@/lib/permissions";
import { hashPassword } from "@/lib/password";
import { optionalNumber, requireEmail, requireString, requireStrongPassword } from "@/lib/validators";

export const runtime = "nodejs";

type UserRow = RowDataPacket & {
  id: number;
  site_id: number | null;
  full_name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
};

export async function GET() {
  await requireRole(["admin"]);

  const users = await query<UserRow[]>(`
    SELECT id, site_id, full_name, email, role, status, created_at
    FROM users
    ORDER BY created_at DESC
    LIMIT 100
  `);

  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const admin = await requireRole(["admin"]);

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const fullName = requireString(body.fullName, "fullName", 255);
    const email = requireEmail(body.email);
    const password = requireStrongPassword(body.password);
    const role = requireString(body.role, "role", 50);
    const siteId = optionalNumber(body.siteId);

    if (!isRole(role)) {
      throw new Error("role is invalid.");
    }

    const result = await query<ResultSetHeader>(
      `
        INSERT INTO users (site_id, full_name, email, password_hash, role, status)
        VALUES (?, ?, ?, ?, ?, 'active')
      `,
      [siteId, fullName, email, hashPassword(password), role],
    );

    await query(
      `
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
        VALUES (?, 'user.created', 'users', ?, ?)
      `,
      [
        admin.id,
        result.insertId,
        JSON.stringify({
          email,
          role,
          siteId,
        }),
      ],
    );

    return NextResponse.json(
      {
        user: {
          id: result.insertId,
          siteId,
          fullName,
          email,
          role,
          status: "active",
        },
      },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "User creation failed.";
    const isDuplicate = message.includes("Duplicate entry") || message.includes("ER_DUP_ENTRY");

    return NextResponse.json(
      { error: isDuplicate ? "email already exists." : message },
      { status: isDuplicate ? 409 : 400 },
    );
  }
}
