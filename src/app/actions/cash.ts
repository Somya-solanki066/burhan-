"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireUser } from "@/lib/auth";
import { parseISODate, todayISO } from "@/lib/dates";
import {
  DENOMINATIONS,
  amountFromNotes,
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
    missingCount: 0,
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
      return { error: "Please select an employee.", success: "", savedAt: 0 };
    }
  }

  let employeeIdValue: string | null = null;
  if (employeeId) {
    const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
    if (!employee || !employee.isActive) {
      return { error: "Please select a valid active employee.", success: "", savedAt: 0 };
    }
    employeeIdValue = employeeId;
  }

  let reason: string | null = null;
  if (type === "OUT") {
    if (!expenseId) {
      return { error: "Please select or create an expense.", success: "", savedAt: 0 };
    }
    const expense = await prisma.expense.findUnique({ where: { id: expenseId } });
    if (!expense || !expense.isActive) {
      return { error: "Please select a valid expense.", success: "", savedAt: 0 };
    }
    reason = expense.name;
  }

  const totalAmount = amountFromNotes(notes);
  const totalNotes = totalPresentNotes(notes);

  if (totalNotes === 0) {
    return { error: "Enter at least one note count.", success: "", savedAt: 0 };
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
      totalMissing: 0,
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
  return { error: "", success: type === "OUT" ? "Cash out saved." : "Cash in saved.", savedAt: Date.now() };
}

export async function createUserNoteAction(_: unknown, formData: FormData) {
  const session = await requireUser();

  const type = String(formData.get("type") || "") === "OUT" ? "OUT" : "IN";
  const employeeId = String(formData.get("employeeId") || "").trim();
  const expenseId = String(formData.get("expenseId") || "").trim();
  const dateValue = String(formData.get("date") || todayISO());
  const remark = String(formData.get("remark") || "").trim();
  const notes = parseNotes(formData);

  if (type === "IN" && !employeeId) {
    return { error: "Please select an employee.", success: "" };
  }

  let employeeIdValue: string | null = null;
  let employeeName: string | null = null;
  if (employeeId) {
    const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
    if (!employee || !employee.isActive) {
      return { error: "Please select a valid employee.", success: "" };
    }
    employeeIdValue = employeeId;
    employeeName = employee.name;
  }

  let reason: string | null = null;
  if (type === "OUT") {
    if (!expenseId) {
      return { error: "Please select an expense.", success: "" };
    }
    const expense = await prisma.expense.findUnique({ where: { id: expenseId } });
    if (!expense || !expense.isActive) {
      return { error: "Please select a valid expense.", success: "" };
    }
    reason = expense.name;
  }

  const creator =
    (await prisma.user.findUnique({
      where: { id: session.id },
      select: { id: true },
    })) ??
    (await prisma.user.findUnique({
      where: { username: session.username },
      select: { id: true },
    }));

  const totalAmount = amountFromNotes(notes);
  const totalNotes = totalPresentNotes(notes);

  if (totalNotes === 0) {
    return { error: "Enter at least one note count.", success: "" };
  }

  await prisma.cashEntry.create({
    data: {
      type,
      employeeId: employeeIdValue,
      expenseId: type === "OUT" ? expenseId : null,
      createdByUserId: creator?.id ?? null,
      date: parseISODate(dateValue),
      remark: remark || null,
      reason,
      totalAmount,
      totalNotes,
      totalMissing: 0,
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
  revalidatePath("/notes/out");
  revalidatePath("/expenses");
  return {
    error: "",
    success:
      type === "OUT"
        ? "Cash out saved. Add a new entry below."
        : `Cash in saved${employeeName ? ` for ${employeeName}` : ""}. Add a new entry below.`,
    savedAt: Date.now(),
  };
}

export async function deleteCashEntryAction(id: string) {
  await requireAdmin();
  await prisma.cashEntry.delete({ where: { id } });
  revalidatePath("/dashboard");
  revalidatePath("/entries");
  revalidatePath("/expenses");
}
