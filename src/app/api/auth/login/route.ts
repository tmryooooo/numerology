import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { verifyPassword, createToken, COOKIE, COOKIE_OPTS } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const rows = await sql`SELECT id, password_hash FROM users WHERE username = ${username}`;
  const user = rows[0] as { id: number; password_hash: string } | undefined;

  if (!user || !(await verifyPassword(password, user.password_hash)))
    return NextResponse.json({ error: "IDまたはパスワードが間違っています" }, { status: 401 });

  const res = NextResponse.json({ ok: true, username });
  res.cookies.set(COOKIE, createToken(user.id), COOKIE_OPTS);
  return res;
}
