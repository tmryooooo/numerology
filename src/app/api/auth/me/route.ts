import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import sql from "@/lib/db";

export async function GET() {
  const userId = getUserId();
  if (!userId) return NextResponse.json({ user: null });

  const rows = await sql`SELECT id, username FROM users WHERE id = ${userId}`;
  const user = rows[0] as { id: number; username: string } | undefined;

  return NextResponse.json({ user: user ?? null });
}
