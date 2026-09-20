import Link from "next/link";
import { getDaySummary, getAllUsers } from "@/lib/queries";
import { formatDisplayDate, todayISO } from "@/lib/dates";
import { formatINR, formatNumber } from "@/lib/format";
import { DENOMINATION_STYLE, type Denomination } from "@/lib/denominations";
import { CopyUserLink } from "@/components/CopyUserLink";
import { RegenerateLinkButton } from "@/components/RegenerateLinkButton";
import { DeleteEntryButton } from "@/components/DeleteEntryButton";
import { DashboardDatePicker } from "@/components/DashboardDatePicker";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  const selectedDate = date || todayISO();
  const [summary, users] = await Promise.all([
    getDaySummary(selectedDate),
    getAllUsers(),
  ]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#145c47]">Daily Cash</p>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="mt-1 text-stone-500">{formatDisplayDate(selectedDate)}</p>
        </div>
        <DashboardDatePicker date={selectedDate} />
      </header>

      <section className="rounded-2xl bg-[#0f3d2e] p-5 text-white">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-emerald-200/80">User note entry</p>
            <h2 className="mt-1 text-xl font-semibold">Unique login links</h2>
            <p className="mt-1 text-sm text-emerald-100/70">
              Each user has a different link. Copy and share it. They enter only the password you set.
            </p>
          </div>
          <Link
            href="/users"
            className="rounded-xl border border-white/20 px-4 py-2.5 font-semibold text-white hover:bg-white/10"
          >
            Manage users
          </Link>
        </div>
        {users.length === 0 ? (
          <p className="mt-4 rounded-xl bg-white/10 px-4 py-3 text-sm text-emerald-100">
            Create a user first to generate a unique link.
          </p>
        ) : (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {users
              .filter((user) => user.isActive)
              .map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between gap-3 rounded-xl bg-white/10 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium">{user.name}</p>
                    <p className="truncate text-xs text-emerald-100/60">
                      {user.linkToken ? `/u/${user.linkToken}` : "No unique link yet"}
                    </p>
                  </div>
                  {user.linkToken ? (
                    <CopyUserLink token={user.linkToken} label="Copy unique link" />
                  ) : (
                    <RegenerateLinkButton
                      userId={user.id}
                      label="Generate unique link"
                      className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#145c47] hover:bg-emerald-50"
                    />
                  )}
                </div>
              ))}
          </div>
        )}
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Cash In"
          value={formatINR(summary.totalIn)}
          hint={`${formatNumber(summary.notesIn)} notes in`}
          tone="in"
        />
        <Stat
          label="Cash Out"
          value={formatINR(summary.totalOut)}
          hint={`${formatNumber(summary.notesOut)} notes out`}
          tone="out"
        />
        <Stat
          label="Net Total"
          value={formatINR(summary.net)}
          hint="In minus Out"
          tone="net"
        />
        <Stat
          label="Total Notes"
          value={formatNumber(summary.notesNet)}
          hint="In minus Out"
          tone="notes"
        />
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Today's note category totals</h2>
          <p className="text-sm text-stone-500">In, out, and net for each denomination</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-stone-500">
              <tr>
                <th className="pb-3 font-medium">Note</th>
                <th className="pb-3 font-medium">In notes</th>
                <th className="pb-3 font-medium">In amount</th>
                <th className="pb-3 font-medium">Out notes</th>
                <th className="pb-3 font-medium">Out amount</th>
                <th className="pb-3 font-medium">Net notes</th>
                <th className="pb-3 font-medium">Net amount</th>
              </tr>
            </thead>
            <tbody>
              {summary.byNote.map((row) => {
                const style = DENOMINATION_STYLE[row.denomination as Denomination];
                return (
                  <tr key={row.denomination} className="border-t border-stone-100">
                    <td className="py-3">
                      <span
                        className={`inline-flex rounded-lg px-3 py-1 font-semibold ${style.bg} ${style.text}`}
                      >
                        ₹{row.denomination}
                      </span>
                    </td>
                    <td>{formatNumber(row.inCount)}</td>
                    <td>{formatINR(row.inAmount)}</td>
                    <td>{formatNumber(row.outCount)}</td>
                    <td className="text-rose-700">{formatINR(row.outAmount)}</td>
                    <td className="font-medium">{formatNumber(row.netCount)}</td>
                    <td className="font-medium">{formatINR(row.netAmount)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold">Today's expenses</h2>
          {summary.byExpense.length === 0 ? (
            <Empty />
          ) : (
            <div className="space-y-3">
              {summary.byExpense.map((expense) => (
                <div
                  key={expense.name}
                  className="flex items-center justify-between rounded-xl bg-rose-50 px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{expense.name}</p>
                    <p className="text-sm text-stone-500">
                      {formatNumber(expense.notes)} notes
                    </p>
                  </div>
                  <p className="font-semibold text-rose-700">{formatINR(expense.amount)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Entries for this date</h2>
            <Link
              href={`/entries?date=${selectedDate}`}
              className="text-sm font-medium text-[#145c47]"
            >
              View all
            </Link>
          </div>
          {summary.entries.length === 0 ? (
            <Empty />
          ) : (
            <div className="space-y-3">
              {summary.entries.slice(0, 8).map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-stone-100 px-4 py-3"
                >
                  <div>
                    <p className="font-medium">
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
                        {entry.type === "IN" ? "IN" : "OUT"}
                      </span>
                    </p>
                    <p className="text-sm text-stone-500">
                      {entry.employee?.name && entry.expense
                        ? entry.employee.name
                        : `${entry.totalNotes} notes`}
                    </p>
                    {entry.remark ? (
                      <p className="mt-1 text-sm text-stone-700">Remark: {entry.remark}</p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-3">
                    <p
                      className={`font-semibold ${
                        entry.type === "IN" ? "text-emerald-800" : "text-rose-700"
                      }`}
                    >
                      {entry.type === "IN" ? "+" : "−"}
                      {formatINR(entry.totalAmount)}
                    </p>
                    <DeleteEntryButton id={entry.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {summary.byEmployee.length > 0 ? (
        <section className="rounded-2xl border border-stone-200 bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold">Today's totals by employee</h2>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {summary.byEmployee.map((employee) => (
              <div
                key={employee.name}
                className="flex items-center justify-between rounded-xl bg-[#f7f3ec] px-4 py-3"
              >
                <div>
                  <p className="font-medium">{employee.name}</p>
                  <p className="text-sm text-stone-500">
                    {formatNumber(employee.notes)} notes
                  </p>
                </div>
                <div className="text-right text-sm">
                  <p className="text-emerald-800">In {formatINR(employee.inAmount)}</p>
                  <p className="text-rose-700">Out {formatINR(employee.outAmount)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  tone: "in" | "out" | "net" | "notes";
}) {
  const tones = {
    in: "bg-emerald-50 text-emerald-950",
    out: "bg-rose-50 text-rose-950",
    net: "bg-amber-50 text-amber-950",
    notes: "bg-white text-stone-950 border border-stone-200",
  };

  return (
    <article className={`rounded-2xl p-5 ${tones[tone]}`}>
      <p className="text-sm opacity-70">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
      <p className="mt-2 text-sm opacity-70">{hint}</p>
    </article>
  );
}

function Empty() {
  return (
    <p className="rounded-xl bg-[#f7f3ec] px-4 py-8 text-center text-sm text-stone-500">
      No entries for this date. Add the first one from Cash In or Cash Out.
    </p>
  );
}
