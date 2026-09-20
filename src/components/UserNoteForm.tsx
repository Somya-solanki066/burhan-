"use client";

import { useMemo, useState } from "react";
import { useActionState } from "react";
import { createUserNoteAction } from "@/app/actions/cash";
import {
  DENOMINATION_STYLE,
  DENOMINATIONS,
  amountFromNotes,
  emptyNoteCounts,
  totalMissingNotes,
  totalPresentNotes,
  type Denomination,
  type NoteCount,
} from "@/lib/denominations";
import { formatINR, formatNumber } from "@/lib/format";
import { todayISO } from "@/lib/dates";

type Employee = { id: string; name: string; role: string };

export function UserNoteForm({ employees }: { employees: Employee[] }) {
  const [selectedId, setSelectedId] = useState(employees[0]?.id || "");
  const [notes, setNotes] = useState<NoteCount[]>(emptyNoteCounts);
  const [state, formAction, pending] = useActionState(createUserNoteAction, {
    error: "",
    success: "",
  });

  const totalAmount = useMemo(() => amountFromNotes(notes), [notes]);
  const present = useMemo(() => totalPresentNotes(notes), [notes]);
  const missing = useMemo(() => totalMissingNotes(notes), [notes]);
  const selected = employees.find((employee) => employee.id === selectedId);

  function update(
    denomination: Denomination,
    field: "presentCount" | "missingCount",
    value: number,
  ) {
    setNotes((current) =>
      current.map((note) =>
        note.denomination === denomination
          ? { ...note, [field]: Math.max(0, value) }
          : note,
      ),
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="employeeId" value={selectedId} />
      <input type="hidden" name="date" value={todayISO()} />

      <section>
        <h2 className="mb-3 text-lg font-semibold">Employees</h2>
        {employees.length === 0 ? (
          <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
            No employees available.
          </p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {employees.map((employee) => {
              const active = employee.id === selectedId;
              return (
                <button
                  key={employee.id}
                  type="button"
                  onClick={() => setSelectedId(employee.id)}
                  className={`rounded-xl border px-4 py-3 text-left ${
                    active
                      ? "border-[#145c47] bg-[#145c47] text-white"
                      : "border-stone-200 bg-white hover:border-[#145c47]/40"
                  }`}
                >
                  <span className="block font-semibold">{employee.name}</span>
                  <span className={`text-sm ${active ? "text-white/80" : "text-stone-500"}`}>
                    {employee.role}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          Note entry{selected ? ` — ${selected.name}` : ""}
        </h2>
        {DENOMINATIONS.map((denomination) => {
          const note = notes.find((item) => item.denomination === denomination)!;
          const style = DENOMINATION_STYLE[denomination];
          return (
            <div
              key={denomination}
              className={`grid items-center gap-4 rounded-2xl border p-4 md:grid-cols-[140px_1fr_1fr_140px] ${style.bg} ${style.border}`}
            >
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wide ${style.text}`}>
                  Note
                </p>
                <p className={`text-2xl font-bold ${style.text}`}>₹{denomination}</p>
              </div>
              <label className="space-y-1">
                <span className="text-xs font-medium text-stone-600">Notes present</span>
                <input
                  name={`present_${denomination}`}
                  type="number"
                  min={0}
                  value={note.presentCount}
                  onChange={(event) =>
                    update(denomination, "presentCount", Number(event.target.value) || 0)
                  }
                  className="w-full rounded-lg border border-black/5 bg-white px-3 py-2 text-center font-semibold"
                />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-medium text-stone-600">Notes missing</span>
                <input
                  name={`missing_${denomination}`}
                  type="number"
                  min={0}
                  value={note.missingCount}
                  onChange={(event) =>
                    update(denomination, "missingCount", Number(event.target.value) || 0)
                  }
                  className="w-full rounded-lg border border-black/5 bg-white px-3 py-2 text-center font-semibold"
                />
              </label>
              <div className="text-right">
                <p className="text-xs text-stone-500">Amount</p>
                <p className={`text-lg font-bold ${style.text}`}>
                  {formatINR(note.presentCount * denomination)}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      <div className="grid gap-3 rounded-2xl bg-[#0f3d2e] p-5 text-white md:grid-cols-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-emerald-200/70">Total</p>
          <p className="mt-1 text-2xl font-semibold">{formatINR(totalAmount)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-emerald-200/70">Present</p>
          <p className="mt-1 text-2xl font-semibold">{formatNumber(present)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-emerald-200/70">Missing</p>
          <p className="mt-1 text-2xl font-semibold">{formatNumber(missing)}</p>
        </div>
        <button
          type="submit"
          disabled={pending || !selectedId}
          className="rounded-xl bg-amber-200 px-4 py-3 font-semibold text-[#0f3d2e] hover:bg-amber-100 disabled:opacity-50"
        >
          {pending ? "Saving..." : "Save notes"}
        </button>
      </div>

      {state?.error ? (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{state.error}</p>
      ) : null}
      {state?.success ? (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {state.success}
        </p>
      ) : null}
    </form>
  );
}
