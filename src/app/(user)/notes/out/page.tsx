import { UserNoteForm } from "@/components/UserNoteForm";
import { UserTodayEntries } from "@/components/UserTodayEntries";
import { requireUser } from "@/lib/auth";
import { todayISO } from "@/lib/dates";
import { getActiveEmployees, getActiveExpenses, getUserDayEntries } from "@/lib/queries";

export default async function UserCashOutPage() {
  const session = await requireUser();
  const date = todayISO();
  const [employees, expenses, entries] = await Promise.all([
    getActiveEmployees(),
    getActiveExpenses(),
    getUserDayEntries(session.id, date, "OUT"),
  ]);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-rose-700">Cash Out</p>
        <h1 className="text-3xl font-semibold">Today's expenses</h1>
        <p className="mt-1 text-stone-500">
          Select an expense, enter the notes, and save. After save, counts reset for a new entry.
        </p>
      </header>
      <UserNoteForm type="OUT" employees={employees} expenses={expenses} />
      <UserTodayEntries
        entries={entries}
        emptyText="No cash out entries saved today yet."
      />
    </div>
  );
}
