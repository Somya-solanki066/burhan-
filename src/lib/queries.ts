import { prisma } from "@/lib/prisma";
import { dayRange } from "@/lib/dates";
import { DENOMINATIONS, type Denomination } from "@/lib/denominations";

export async function getActiveEmployees() {
  return prisma.employee.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
}

export async function getAllEmployees() {
  return prisma.employee.findMany({
    orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
    include: {
      _count: { select: { entries: true } },
    },
  });
}

export async function getAllUsers() {
  return prisma.user.findMany({
    orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
  });
}

export async function getUserByLinkToken(token: string) {
  return prisma.user.findUnique({
    where: { linkToken: token },
    select: { id: true, name: true, username: true, isActive: true, linkToken: true },
  });
}

export async function getActiveExpenses() {
  return prisma.expense.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
}

export async function getAllExpenses() {
  return prisma.expense.findMany({
    orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
    include: {
      _count: { select: { entries: true } },
      entries: { select: { totalAmount: true } },
    },
  });
}

export async function getDaySummary(dateISO: string) {
  const entries = await prisma.cashEntry.findMany({
    where: { date: dayRange(dateISO) },
    include: {
      employee: true,
      expense: true,
      denominations: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const inEntries = entries.filter((entry) => entry.type === "IN");
  const outEntries = entries.filter((entry) => entry.type === "OUT");

  const totalIn = inEntries.reduce((sum, entry) => sum + entry.totalAmount, 0);
  const totalOut = outEntries.reduce((sum, entry) => sum + entry.totalAmount, 0);
  const notesIn = inEntries.reduce((sum, entry) => sum + entry.totalNotes, 0);
  const notesOut = outEntries.reduce((sum, entry) => sum + entry.totalNotes, 0);

  const byNote = DENOMINATIONS.map((denomination) => {
    const inCount = sumDenom(inEntries, denomination);
    const outCount = sumDenom(outEntries, denomination);

    return {
      denomination,
      inCount,
      outCount,
      netCount: inCount - outCount,
      inAmount: inCount * denomination,
      outAmount: outCount * denomination,
      netAmount: (inCount - outCount) * denomination,
    };
  });

  const employeeMap = new Map<
    string,
    { name: string; inAmount: number; outAmount: number; notes: number }
  >();

  for (const entry of entries) {
    if (!entry.employeeId || !entry.employee) continue;
    const current = employeeMap.get(entry.employeeId) ?? {
      name: entry.employee.name,
      inAmount: 0,
      outAmount: 0,
      notes: 0,
    };
    if (entry.type === "IN") current.inAmount += entry.totalAmount;
    if (entry.type === "OUT") current.outAmount += entry.totalAmount;
    current.notes += entry.totalNotes;
    employeeMap.set(entry.employeeId, current);
  }

  const expenseMap = new Map<string, { name: string; amount: number; notes: number }>();
  for (const entry of outEntries) {
    const name = entry.expense?.name || entry.reason || "Uncategorized";
    const current = expenseMap.get(name) ?? { name, amount: 0, notes: 0 };
    current.amount += entry.totalAmount;
    current.notes += entry.totalNotes;
    expenseMap.set(name, current);
  }

  return {
    entries,
    totalIn,
    totalOut,
    net: totalIn - totalOut,
    notesIn,
    notesOut,
    notesNet: notesIn - notesOut,
    byNote,
    byEmployee: [...employeeMap.values()].sort(
      (a, b) => b.inAmount + b.outAmount - (a.inAmount + a.outAmount),
    ),
    byExpense: [...expenseMap.values()].sort((a, b) => b.amount - a.amount),
  };
}

function sumDenom(
  entries: {
    denominations: { denomination: number; presentCount: number }[];
  }[],
  denomination: Denomination,
) {
  return entries.reduce((sum, entry) => {
    const row = entry.denominations.find((item) => item.denomination === denomination);
    return sum + (row ? row.presentCount : 0);
  }, 0);
}

export async function getFilteredEntries(filters: {
  date?: string;
  type?: "IN" | "OUT" | "";
  employeeId?: string;
}) {
  return prisma.cashEntry.findMany({
    where: {
      date: filters.date ? dayRange(filters.date) : undefined,
      type: filters.type ? filters.type : undefined,
      employeeId: filters.employeeId || undefined,
    },
    include: {
      employee: true,
      expense: true,
      denominations: { orderBy: { denomination: "desc" } },
    },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    take: 200,
  });
}

export async function getUserDayEntries(userId: string, dateISO: string) {
  return prisma.cashEntry.findMany({
    where: {
      createdByUserId: userId,
      date: dayRange(dateISO),
    },
    include: {
      employee: true,
      denominations: { orderBy: { denomination: "desc" } },
    },
    orderBy: { createdAt: "desc" },
  });
}
