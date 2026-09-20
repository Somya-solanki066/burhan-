import { getActiveEmployees, getFilteredEntries } from "@/lib/queries";
import { formatDisplayDate } from "@/lib/dates";
import { formatINR, formatNumber } from "@/lib/format";
import { DeleteEntryButton } from "@/components/DeleteEntryButton";

export default async function EntriesPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; type?: string; employeeId?: string }>;
}) {
  const params = await searchParams;
  const date = params.date || "";
  const type = params.type === "IN" || params.type === "OUT" ? params.type : "";
  const employeeId = params.employeeId || "";
  const [entries, employees] = await Promise.all([
    getFilteredEntries({ date, type, employeeId }),
    getActiveEmployees(),
  ]);

  const totalIn = entries
    .filter((entry) => entry.type === "IN")
    .reduce((sum, entry) => sum + entry.totalAmount, 0);
  const totalOut = entries
    .filter((entry) => entry.type === "OUT")
    .reduce((sum, entry) => sum + entry.totalAmount, 0);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-[#145c47]">History</p>
        <h1 className="text-3xl font-semibold">All entries</h1>
      </header>

      <form className="grid gap-3 rounded-2xl border border-stone-200 bg-white p-4 md:grid-cols-4">
        <input
          type="date"
          name="date"
          defaultValue={date}
          className="rounded-xl border border-stone-200 px-4 py-3"
        />
        <select
          name="type"
          defaultValue={type}
          className="rounded-xl border border-stone-200 px-4 py-3"
        >
          <option value="">In + Out</option>
          <option value="IN">Cash In</option>
          <option value="OUT">Cash Out</option>
        </select>
        <select
          name="employeeId"
          defaultValue={employeeId}
          className="rounded-xl border border-stone-200 px-4 py-3"
        >
          <option value="">All employees</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.name}
            </option>
          ))}
        </select>
        <button className="rounded-xl bg-[#145c47] px-4 py-3 font-medium text-white">
          Filter
        </button>
      </form>

      <div className="grid gap-4 md:grid-cols-3">
        <Summary label="Filtered In" value={formatINR(totalIn)} />
        <Summary label="Filtered Out" value={formatINR(totalOut)} />
        <Summary label="Net" value={formatINR(totalIn - totalOut)} />
      </div>

      <section className="space-y-4">
        {entries.length === 0 ? (
          <p className="rounded-2xl bg-white px-4 py-10 text-center text-stone-500">
            No entries match this filter.
          </p>
        ) : (
          entries.map((entry) => (
            <article
              key={entry.id}
              className="rounded-2xl border border-stone-200 bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    {entry.expense?.name ||
                      entry.employee?.name ||
                      "Direct expense"}
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                        entry.type === "IN"
                          ? "bg-emerald-50 text-emerald-800"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {entry.type}
                    </span>
                  </p>
                  <p className="text-sm text-stone-500">
                    {formatDisplayDate(entry.date.toISOString().slice(0, 10))}
                    {entry.employee ? ` · ${entry.employee.name}` : ""}
                    {entry.expense ? ` · ${entry.expense.name}` : ""}
                    {entry.remark ? ` · ${entry.remark}` : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-xl font-semibold ${
                      entry.type === "IN" ? "text-emerald-800" : "text-rose-700"
                    }`}
                  >
                    {entry.type === "IN" ? "+" : "−"}
                    {formatINR(entry.totalAmount)}
                  </p>
                  <p className="text-sm text-stone-500">
                    {formatNumber(entry.totalNotes)} notes,{" "}
                    {formatNumber(entry.totalMissing)} missing
                  </p>
                  <DeleteEntryButton id={entry.id} />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {entry.denominations.map((note) =>
                  note.presentCount || note.missingCount ? (
                    <span
                      key={note.id}
                      className="rounded-lg bg-[#f7f3ec] px-3 py-1.5 text-sm"
                    >
                      ₹{note.denomination}: {note.presentCount} present
                      {note.missingCount ? ` / ${note.missingCount} missing` : ""}
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

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-5">
      <p className="text-sm text-stone-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}
