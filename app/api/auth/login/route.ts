import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";
import { createSessionToken, sessionCookieName } from "@/lib/auth";
import { isDatabaseConfigured, query } from "@/lib/db";
import { findDemoUser } from "@/lib/demo-store";
import { isRole } from "@/lib/permissions";
import { verifyPassword } from "@/lib/password";
import { requireString } from "@/lib/validators";

type UserRow = RowDataPacket & {
  id: number;
  site_id: number | null;
  full_name: string;
  email: string;
  password_hash: string;
  role: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const email = requireString(body.email, "email").toLowerCase();
    const password = requireString(body.password, "password", 512);

    if (!isDatabaseConfigured()) {
      const demoUser = findDemoUser(email);
      if (!demoUser || !verifyPassword(password, demoUser.password_hash)) {
        return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
      }

      const response = NextResponse.json({ role: demoUser.role });
      response.cookies.set({
        name: sessionCookieName,
        value: createSessionToken({
          id: demoUser.id,
          fullName: demoUser.full_name,
          email: demoUser.email,
          role: demoUser.role,
          siteId: demoUser.site_id,
        }),
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.COOKIE_SECURE !== "false",
        path: "/",
        maxAge: 60 * 60 * 12,
      });

      return response;
    }

    const users = await query<UserRow[]>(
      "SELECT id, site_id, full_name, email, password_hash, role FROM users WHERE email = ? AND status = 'active' LIMIT 1",
      [email],
    );
    const user = users[0];

    if (!user || !isRole(user.role) || !verifyPassword(password, user.password_hash)) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const sessionUser = {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      role: user.role,
      siteId: user.site_id,
    };
    const response = NextResponse.json({ role: user.role });

    response.cookies.set({
      name: sessionCookieName,
      value: createSessionToken(sessionUser),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.COOKIE_SECURE !== "false",
      path: "/",
      maxAge: 60 * 60 * 12,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Login failed." },
      { status: 400 },
    );
  }
}
