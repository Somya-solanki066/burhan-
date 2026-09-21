"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function createEmployeeAction(_: unknown, formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const role = String(formData.get("role") || "Cashier").trim() || "Cashier";

  if (!name) {
    return { error: "Employee name is required.", success: "" };
  }

  await prisma.employee.create({
    data: {
      name,
      phone: phone || null,
      role,
    },
  });

  revalidatePath("/employees");
  revalidatePath("/dashboard");
  revalidatePath("/cash-in");
  revalidatePath("/cash-out");
  revalidatePath("/notes");
  revalidatePath("/notes/out");
  return { error: "", success: `${name} has been added.` };
}

export async function toggleEmployeeAction(id: string) {
  await requireAdmin();

  const employee = await prisma.employee.findUnique({ where: { id } });
  if (!employee) return;

  await prisma.employee.update({
    where: { id },
    data: { isActive: !employee.isActive },
  });

  revalidatePath("/employees");
  revalidatePath("/cash-in");
  revalidatePath("/cash-out");
  revalidatePath("/notes");
  revalidatePath("/notes/out");
}
