import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { hashPassword, createToken, COOKIE, COOKIE_OPTS } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || username.length < 3)
    return NextResponse.json({ error: "IDは3文字以上で入力してください" }, { status: 400 });
  if (!password || password.length < 6)
    return NextResponse.json({ error: "パスワードは6文字以上で入力してください" }, { status: 400 });

  const existing = await sql`SELECT id FROM users WHERE username = ${username}`;
  if (existing.length > 0)
    return NextResponse.json({ error: "このIDは既に使用されています" }, { status: 400 });

  const hash = await hashPassword(password);
  const [row] = await sql`
    INSERT INTO users (username, password_hash) VALUES (${username}, ${hash}) RETURNING id
  `;

  const res = NextResponse.json({ ok: true, username });
  res.cookies.set(COOKIE, createToken(row.id as number), COOKIE_OPTS);
  return res;
}
