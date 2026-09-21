"use client";

import { useEffect, useMemo, useState } from "react";
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
type Expense = { id: string; name: string };

export function UserNoteForm({
  type,
  employees,
  expenses = [],
}: {
  type: "IN" | "OUT";
  employees: Employee[];
  expenses?: Expense[];
}) {
  const [selectedId, setSelectedId] = useState(
    type === "OUT" ? "" : employees[0]?.id || "",
  );
  const [expenseId, setExpenseId] = useState("");
  const [remark, setRemark] = useState("");
  const [notes, setNotes] = useState<NoteCount[]>(emptyNoteCounts);
  const [state, formAction, pending] = useActionState(createUserNoteAction, {
    error: "",
    success: "",
    savedAt: 0,
  });

  const totalAmount = useMemo(() => amountFromNotes(notes), [notes]);
  const present = useMemo(() => totalPresentNotes(notes), [notes]);
  const selected = employees.find((employee) => employee.id === selectedId);
  const isOut = type === "OUT";
  const canSubmit = isOut ? expenses.length > 0 : employees.length > 0;

  useEffect(() => {
    if (!state?.savedAt) return;
    setNotes(emptyNoteCounts());
    setRemark("");
  }, [state?.savedAt]);

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
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="date" value={todayISO()} />
      {!isOut ? <input type="hidden" name="employeeId" value={selectedId} /> : null}

      {isOut ? (
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-stone-600">Employee (optional)</span>
            <select
              name="employeeId"
              value={selectedId}
              onChange={(event) => setSelectedId(event.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-[#1f7a60]/15"
            >
              <option value="">No employee — direct expense</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} — {employee.role}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-stone-600">Expense</span>
            <select
              name="expenseId"
              required
              value={expenseId}
              onChange={(event) => setExpenseId(event.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-[#1f7a60]/15"
            >
              <option value="" disabled>
                Select expense
              </option>
              {expenses.map((expense) => (
                <option key={expense.id} value={expense.id}>
                  {expense.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : (
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
      )}

      <label className="block space-y-2">
        <span className="text-sm font-medium text-stone-600">Remark</span>
        <input
          name="remark"
          value={remark}
          onChange={(event) => setRemark(event.target.value)}
          placeholder={isOut ? "What was this expense for" : "Optional note for this entry"}
          className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-[#1f7a60]/15"
        />
      </label>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          {isOut ? "Cash out notes" : "Cash in notes"}
          {!isOut && selected ? ` — ${selected.name}` : ""}
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
          disabled={pending || !canSubmit || (!isOut && !selectedId)}
          className={`rounded-xl px-4 py-3 font-semibold text-[#0f3d2e] disabled:opacity-50 ${
            isOut ? "bg-rose-200 hover:bg-rose-100" : "bg-amber-200 hover:bg-amber-100"
          }`}
        >
          {pending ? "Saving..." : isOut ? "Save cash out" : "Save cash in"}
        </button>
      </div>

      {!canSubmit ? (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {isOut
            ? "Ask admin to add an expense first."
            : "Ask admin to add an employee first."}
        </p>
      ) : null}

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
