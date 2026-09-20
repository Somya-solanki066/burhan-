import { ExpenseForm } from "@/components/ExpenseForm";
import { ToggleExpenseButton } from "@/components/ToggleExpenseButton";
import { getAllExpenses } from "@/lib/queries";
import { formatDateTime } from "@/lib/dates";
import { formatINR, formatNumber } from "@/lib/format";
import Link from "next/link";

export default async function ExpensesPage() {
  const expenses = await getAllExpenses();

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-rose-700">Cash Out</p>
          <h1 className="text-3xl font-semibold">Expenses</h1>
          <p className="mt-1 text-stone-500">
            Create expense types here, then pick them on Cash Out without selecting an employee.
          </p>
        </div>
        <Link
          href="/cash-out"
          className="rounded-xl bg-[#145c47] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0f3d2e]"
        >
          Record cash out
        </Link>
      </header>

      <ExpenseForm />

      <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#f7f3ec] text-stone-500">
            <tr>
              <th className="px-5 py-3 font-medium">Expense</th>
              <th className="px-5 py-3 font-medium">Entries</th>
              <th className="px-5 py-3 font-medium">Total spent</th>
              <th className="px-5 py-3 font-medium">Added</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-stone-500">
                  No expenses yet. Add one using the form above.
                </td>
              </tr>
            ) : (
              expenses.map((expense) => {
                const spent = expense.entries.reduce(
                  (sum, entry) => sum + entry.totalAmount,
                  0,
                );
                return (
                  <tr key={expense.id} className="border-t border-stone-100">
                    <td className="px-5 py-4 font-medium">{expense.name}</td>
                    <td className="px-5 py-4">{formatNumber(expense._count.entries)}</td>
                    <td className="px-5 py-4 text-rose-700">{formatINR(spent)}</td>
                    <td className="px-5 py-4 text-stone-500">
                      {formatDateTime(expense.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          expense.isActive
                            ? "bg-emerald-50 text-emerald-800"
                            : "bg-stone-100 text-stone-500"
                        }`}
                      >
                        {expense.isActive ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <ToggleExpenseButton id={expense.id} isActive={expense.isActive} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
