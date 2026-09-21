"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function createExpenseAction(_: unknown, formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") || "").trim();
  if (!name) {
    return { error: "Expense name is required.", success: "" };
  }

  const existing = await prisma.expense.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
  });
  if (existing) {
    return { error: "This expense already exists.", success: "" };
  }

  await prisma.expense.create({ data: { name } });

  revalidatePath("/expenses");
  revalidatePath("/cash-out");
  revalidatePath("/notes/out");
  revalidatePath("/dashboard");
  return { error: "", success: `${name} has been added.` };
}

export async function toggleExpenseAction(id: string) {
  await requireAdmin();

  const expense = await prisma.expense.findUnique({ where: { id } });
  if (!expense) return;

  await prisma.expense.update({
    where: { id },
    data: { isActive: !expense.isActive },
  });

  revalidatePath("/expenses");
  revalidatePath("/cash-out");
  revalidatePath("/notes/out");
}
