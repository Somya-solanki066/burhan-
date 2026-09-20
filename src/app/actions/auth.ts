"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { clearSession, createSession, getSession } from "@/lib/auth";

export async function loginAction(_: unknown, formData: FormData) {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  if (!username || !password) {
    return { error: "Username and password are required." };
  }

  try {
    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin) {
      return { error: "Incorrect username or password." };
    }

    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) {
      return { error: "Incorrect username or password." };
    }

    await createSession({
      role: "admin",
      id: admin.id,
      username: admin.username,
      name: admin.name,
    });
  } catch (error) {
    console.error("Admin login failed", error);
    return {
      error:
        "Database is not connected. Add DATABASE_URL and AUTH_SECRET in Vercel, then redeploy.",
    };
  }

  redirect("/dashboard");
}

export async function userLoginAction(_: unknown, formData: FormData) {
  const token = String(formData.get("token") || "").trim();
  const password = String(formData.get("password") || "");

  if (!token || !password) {
    return { error: "Password is required." };
  }

  try {
    const user = await prisma.user.findUnique({ where: { linkToken: token } });
    if (!user || !user.isActive) {
      return { error: "This login link is invalid." };
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return { error: "Incorrect password." };
    }

    await createSession({
      role: "user",
      id: user.id,
      username: user.username,
      name: user.name,
    });
  } catch (error) {
    console.error("User login failed", error);
    return {
      error:
        "Database is not connected. Add DATABASE_URL and AUTH_SECRET in Vercel, then redeploy.",
    };
  }

  redirect("/notes");
}

export async function logoutAction() {
  const session = await getSession();
  await clearSession();
  redirect(session?.role === "user" ? "/u" : "/");
}
