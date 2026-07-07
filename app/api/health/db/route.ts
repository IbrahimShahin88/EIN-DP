import { NextResponse } from "next/server";
import { pingDatabase } from "@/lib/db";

export async function GET() {
  try {
    const connected = await pingDatabase();
    return NextResponse.json({ connected });
  } catch (error) {
    return NextResponse.json(
      { connected: false, error: error instanceof Error ? error.message : "Database unavailable." },
      { status: 500 },
    );
  }
}
