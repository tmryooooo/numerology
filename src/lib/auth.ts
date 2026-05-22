import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET = process.env.JWT_SECRET ?? "numerology-secret-dev-key";
export const COOKIE = "num_token";

export const hashPassword = (pw: string) => bcrypt.hash(pw, 10);
export const verifyPassword = (pw: string, hash: string) => bcrypt.compare(pw, hash);

export function createToken(userId: number): string {
  return jwt.sign({ userId }, SECRET, { expiresIn: "30d" });
}

export function verifyToken(token: string): number | null {
  try {
    const p = jwt.verify(token, SECRET) as { userId: number };
    return p.userId;
  } catch {
    return null;
  }
}

export function getUserId(): number | null {
  const token = cookies().get(COOKIE)?.value;
  return token ? verifyToken(token) : null;
}

export const COOKIE_OPTS = {
  httpOnly: true,
  path: "/",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 30,
};
