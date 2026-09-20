"use client";

import { useMemo, useState } from "react";
import { useActionState } from "react";
import { createUserNoteAction } from "@/app/actions/cash";
import {
  amountFromNotes,
  emptyNoteCounts,
  totalPresentNotes,
  type Denomination,
  type NoteCount,
} from "@/lib/denominations";
import { formatINR, formatNumber } from "@/lib/format";
import { todayISO } from "@/lib/dates";
import { NoteCountBoxes } from "@/components/NoteCountBoxes";

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
  const selected = employees.find((employee) => employee.id === selectedId);

  function update(denomination: Denomination, value: number) {
    setNotes((current) =>
      current.map((note) =>
        note.denomination === denomination
          ? { ...note, presentCount: Math.max(0, value) }
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

      <label className="block space-y-2">
        <span className="text-sm font-medium text-stone-600">Remark</span>
        <input
          name="remark"
          placeholder="Optional note for this entry"
          className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-[#1f7a60]/15"
        />
      </label>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          Note entry{selected ? ` — ${selected.name}` : ""}
        </h2>
        <NoteCountBoxes notes={notes} onChange={update} />
      </section>

      <div className="grid gap-3 rounded-2xl bg-[#0f3d2e] p-5 text-white md:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-emerald-200/70">Total</p>
          <p className="mt-1 text-2xl font-semibold">{formatINR(totalAmount)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-emerald-200/70">Present</p>
          <p className="mt-1 text-2xl font-semibold">{formatNumber(present)}</p>
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
