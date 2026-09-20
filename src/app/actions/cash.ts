"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireUser } from "@/lib/auth";
import { parseISODate, todayISO } from "@/lib/dates";
import {
  DENOMINATIONS,
  amountFromNotes,
  totalMissingNotes,
  totalPresentNotes,
  type NoteCount,
} from "@/lib/denominations";

function parseNotes(formData: FormData): NoteCount[] {
  return DENOMINATIONS.map((denomination) => ({
    denomination,
    presentCount: Math.max(
      0,
      Number(formData.get(`present_${denomination}`)) || 0,
    ),
    missingCount: Math.max(
      0,
      Number(formData.get(`missing_${denomination}`)) || 0,
    ),
  }));
}

export async function createCashEntryAction(
  type: "IN" | "OUT",
  _: unknown,
  formData: FormData,
) {
  await requireAdmin();

  const employeeId = String(formData.get("employeeId") || "").trim();
  const expenseId = String(formData.get("expenseId") || "").trim();
  const dateValue = String(formData.get("date") || todayISO());
  const remark = String(formData.get("remark") || "").trim();
  const notes = parseNotes(formData);

  if (type === "IN") {
    if (!employeeId) {
      return { error: "Please select an employee." };
    }
  }

  let employeeIdValue: string | null = null;
  if (employeeId) {
    const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
    if (!employee || !employee.isActive) {
      return { error: "Please select a valid active employee." };
    }
    employeeIdValue = employeeId;
  }

  let reason: string | null = null;
  if (type === "OUT") {
    if (!expenseId) {
      return { error: "Please select or create an expense." };
    }
    const expense = await prisma.expense.findUnique({ where: { id: expenseId } });
    if (!expense || !expense.isActive) {
      return { error: "Please select a valid expense." };
    }
    reason = expense.name;
  }

  const totalAmount = amountFromNotes(notes);
  const totalNotes = totalPresentNotes(notes);
  const totalMissing = totalMissingNotes(notes);

  if (totalNotes === 0 && totalMissing === 0) {
    return { error: "Enter at least one note count." };
  }

  await prisma.cashEntry.create({
    data: {
      type,
      employeeId: employeeIdValue,
      expenseId: type === "OUT" ? expenseId : null,
      date: parseISODate(dateValue),
      remark: remark || null,
      reason,
      totalAmount,
      totalNotes,
      totalMissing,
      denominations: {
        create: notes.map((note) => ({
          denomination: note.denomination,
          presentCount: note.presentCount,
          missingCount: note.missingCount,
        })),
      },
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/entries");
  revalidatePath("/cash-in");
  revalidatePath("/cash-out");
  revalidatePath("/expenses");
  redirect("/dashboard");
}

export async function createUserNoteAction(_: unknown, formData: FormData) {
  await requireUser();

  const employeeId = String(formData.get("employeeId") || "").trim();
  const dateValue = String(formData.get("date") || todayISO());
  const notes = parseNotes(formData);

  if (!employeeId) {
    return { error: "Please select an employee.", success: "" };
  }

  const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
  if (!employee || !employee.isActive) {
    return { error: "Please select a valid employee.", success: "" };
  }

  const totalAmount = amountFromNotes(notes);
  const totalNotes = totalPresentNotes(notes);
  const totalMissing = totalMissingNotes(notes);

  if (totalNotes === 0 && totalMissing === 0) {
    return { error: "Enter at least one note count.", success: "" };
  }

  await prisma.cashEntry.create({
    data: {
      type: "IN",
      employeeId,
      date: parseISODate(dateValue),
      totalAmount,
      totalNotes,
      totalMissing,
      denominations: {
        create: notes.map((note) => ({
          denomination: note.denomination,
          presentCount: note.presentCount,
          missingCount: note.missingCount,
        })),
      },
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/entries");
  revalidatePath("/notes");
  return { error: "", success: `Notes saved for ${employee.name}.` };
}

export async function deleteCashEntryAction(id: string) {
  await requireAdmin();
  await prisma.cashEntry.delete({ where: { id } });
  revalidatePath("/dashboard");
  revalidatePath("/entries");
  revalidatePath("/expenses");
}
