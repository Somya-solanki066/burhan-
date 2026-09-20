import { UserNoteForm } from "@/components/UserNoteForm";
import { requireUser } from "@/lib/auth";
import { dateToISO, formatDisplayDate, todayISO } from "@/lib/dates";
import { formatINR, formatNumber } from "@/lib/format";
import { getActiveEmployees, getUserDayEntries } from "@/lib/queries";

export default async function NotesPage() {
  const session = await requireUser();
  const date = todayISO();
  const [employees, entries] = await Promise.all([
    getActiveEmployees(),
    getUserDayEntries(session.id, date),
  ]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Enter notes</h1>
        <p className="mt-1 text-stone-500">
          Select an employee, enter the notes, and add a remark if needed.
        </p>
      </header>
      <UserNoteForm employees={employees} />

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Today's entries</h2>
        {entries.length === 0 ? (
          <p className="rounded-2xl bg-white px-4 py-8 text-center text-stone-500">
            No entries saved today yet.
          </p>
        ) : (
          entries.map((entry) => (
            <article
              key={entry.id}
              className="rounded-2xl border border-stone-200 bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{entry.employee?.name || "Employee"}</p>
                  <p className="text-sm text-stone-500">
                    {formatDisplayDate(dateToISO(entry.date))}
                    {` · ${formatNumber(entry.totalNotes)} notes`}
                  </p>
                  {entry.remark ? (
                    <p className="mt-2 rounded-xl bg-[#f7f3ec] px-3 py-2 text-sm text-stone-700">
                      Remark: {entry.remark}
                    </p>
                  ) : null}
                </div>
                <p className="text-xl font-semibold text-emerald-800">
                  {formatINR(entry.totalAmount)}
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {entry.denominations.map((note) =>
                  note.presentCount ? (
                    <span
                      key={note.id}
                      className="rounded-lg bg-[#f7f3ec] px-3 py-1.5 text-sm"
                    >
                      ₹{note.denomination}: {note.presentCount}
                    </span>
                  ) : null,
                )}
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
