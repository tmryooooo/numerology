import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import sql from "@/lib/db";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await sql`DELETE FROM readings WHERE id = ${params.id} AND user_id = ${userId}`;
  return NextResponse.json({ ok: true });
}
