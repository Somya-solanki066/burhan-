import { CashForm } from "@/components/CashForm";
import { getActiveEmployees, getActiveExpenses } from "@/lib/queries";
import Link from "next/link";

export default async function CashOutPage() {
  const [employees, expenses] = await Promise.all([
    getActiveEmployees(),
    getActiveExpenses(),
  ]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-rose-700">Cash Out</p>
          <h1 className="text-3xl font-semibold">Today's expenses</h1>
          <p className="mt-1 text-stone-500">
            Create a direct expense entry without selecting an employee, or attach one if needed.
          </p>
        </div>
        <Link
          href="/expenses"
          className="rounded-xl bg-rose-100 px-4 py-2.5 text-sm font-semibold text-rose-800 hover:bg-rose-200"
        >
          New expense
        </Link>
      </header>
      <CashForm type="OUT" employees={employees} expenses={expenses} />
    </div>
  );
}
