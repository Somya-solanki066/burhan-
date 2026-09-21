import { dateToISO, formatDisplayDate } from "@/lib/dates";
import { formatINR, formatNumber } from "@/lib/format";

type Entry = {
  id: string;
  type: "IN" | "OUT";
  totalAmount: number;
  totalNotes: number;
  remark: string | null;
  date: Date;
  employee: { name: string } | null;
  expense: { name: string } | null;
  denominations: { id: string; denomination: number; presentCount: number }[];
};

export function UserTodayEntries({
  entries,
  emptyText,
}: {
  entries: Entry[];
  emptyText: string;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Today's entries</h2>
      {entries.length === 0 ? (
        <p className="rounded-2xl bg-white px-4 py-8 text-center text-stone-500">
          {emptyText}
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
                  {entry.expense?.name || entry.employee?.name || "Direct expense"}
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
                  {formatDisplayDate(dateToISO(entry.date))}
                  {entry.employee ? ` · ${entry.employee.name}` : ""}
                  {` · ${formatNumber(entry.totalNotes)} notes`}
                </p>
                {entry.remark ? (
                  <p className="mt-2 rounded-xl bg-[#f7f3ec] px-3 py-2 text-sm text-stone-700">
                    Remark: {entry.remark}
                  </p>
                ) : null}
              </div>
              <p
                className={`text-xl font-semibold ${
                  entry.type === "IN" ? "text-emerald-800" : "text-rose-700"
                }`}
              >
                {entry.type === "IN" ? "+" : "−"}
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
  );
}
