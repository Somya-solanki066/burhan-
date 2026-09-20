"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { createLinkToken } from "@/lib/tokens";

export async function createUserAction(_: unknown, formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") || "").trim();
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  if (!name || !username || !password) {
    return { error: "Name, username, and password are required.", success: "" };
  }

  if (password.length < 4) {
    return { error: "Password must be at least 4 characters.", success: "" };
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return { error: "This username is already taken.", success: "" };
  }

  await prisma.user.create({
    data: {
      name,
      username,
      password: await bcrypt.hash(password, 10),
      linkToken: createLinkToken(),
    },
  });

  revalidatePath("/users");
  revalidatePath("/dashboard");
  return { error: "", success: `${username} created. Copy their unique login link.` };
}

export async function updateUserPasswordAction(_: unknown, formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") || "");
  const password = String(formData.get("password") || "");

  if (!id || password.length < 4) {
    return { error: "Enter a new password of at least 4 characters.", success: "" };
  }

  await prisma.user.update({
    where: { id },
    data: { password: await bcrypt.hash(password, 10) },
  });

  revalidatePath("/users");
  return { error: "", success: "Password updated." };
}

export async function toggleUserAction(id: string) {
  await requireAdmin();

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return;

  await prisma.user.update({
    where: { id },
    data: { isActive: !user.isActive },
  });

  revalidatePath("/users");
}

export async function regenerateUserLinkAction(id: string) {
  await requireAdmin();

  await prisma.user.update({
    where: { id },
    data: { linkToken: createLinkToken() },
  });

  revalidatePath("/users");
  revalidatePath("/dashboard");
}
