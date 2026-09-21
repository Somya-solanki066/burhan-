import { UserNoteForm } from "@/components/UserNoteForm";
import { UserTodayEntries } from "@/components/UserTodayEntries";
import { requireUser } from "@/lib/auth";
import { todayISO } from "@/lib/dates";
import { getActiveEmployees, getUserDayEntries } from "@/lib/queries";

export default async function UserCashInPage() {
  const session = await requireUser();
  const date = todayISO();
  const [employees, entries] = await Promise.all([
    getActiveEmployees(),
    getUserDayEntries(session.id, date, "IN"),
  ]);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-emerald-800">Cash In</p>
        <h1 className="text-3xl font-semibold">Incoming notes</h1>
        <p className="mt-1 text-stone-500">
          Select an employee, enter the notes, and save. After save, counts reset for a new entry.
        </p>
      </header>
      <UserNoteForm type="IN" employees={employees} />
      <UserTodayEntries
        entries={entries}
        emptyText="No cash in entries saved today yet."
      />
    </div>
  );
}
