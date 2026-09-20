import { jwtVerify } from "jose";

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value) {
    throw new Error("AUTH_SECRET is missing");
  }
  return new TextEncoder().encode(value);
}

export async function readRoleFromToken(token: string): Promise<"admin" | "user" | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload.role === "user" ? "user" : "admin";
  } catch {
    return null;
  }
}
