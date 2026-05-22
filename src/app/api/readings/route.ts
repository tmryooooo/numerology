import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import sql from "@/lib/db";

export async function GET() {
  const userId = getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await sql`
    SELECT id, name, date_of_birth, results, created_at
    FROM readings WHERE user_id = ${userId} ORDER BY created_at DESC
  `;

  return NextResponse.json({
    readings: rows.map((r: any) => ({ ...r, results: JSON.parse(r.results) })),
  });
}

export async function POST(req: NextRequest) {
  const userId = getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, dateOfBirth, results } = await req.json();
  const [row] = await sql`
    INSERT INTO readings (user_id, name, date_of_birth, results)
    VALUES (${userId}, ${name}, ${dateOfBirth}, ${JSON.stringify(results)})
    RETURNING id
  `;

  return NextResponse.json({ id: row.id });
}
