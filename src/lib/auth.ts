import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { readRoleFromToken } from "@/lib/session-token";

export { readRoleFromToken };

const COOKIE = "burhan_session";

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value) {
    throw new Error("AUTH_SECRET is missing");
  }
  return new TextEncoder().encode(value);
}

export type Session = {
  role: "admin" | "user";
  id: string;
  username: string;
  name: string;
};

export async function createSession(payload: Session) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret());
    return {
      role: payload.role === "user" ? "user" : "admin",
      id: String(payload.id || payload.adminId),
      username: String(payload.username),
      name: String(payload.name),
    };
  } catch {
    return null;
  }
}

export async function requireSession() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireSession();
  if (session.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function requireUser() {
  const session = await requireSession();
  if (session.role !== "user") {
    throw new Error("Unauthorized");
  }
  return session;
}
