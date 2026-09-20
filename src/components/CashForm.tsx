"use client";

import { useMemo, useState } from "react";
import { useActionState } from "react";
import { createCashEntryAction } from "@/app/actions/cash";
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

export function CashForm({
  type,
  employees,
  expenses = [],
}: {
  type: "IN" | "OUT";
  employees: Employee[];
  expenses?: Expense[];
}) {
  const [notes, setNotes] = useState<NoteCount[]>(emptyNoteCounts);
  const action = createCashEntryAction.bind(null, type);
  const [state, formAction, pending] = useActionState(action, { error: "" });

  const totalAmount = useMemo(() => amountFromNotes(notes), [notes]);
  const present = useMemo(() => totalPresentNotes(notes), [notes]);

  function update(denomination: Denomination, value: number) {
    setNotes((current) =>
      current.map((note) =>
        note.denomination === denomination
          ? { ...note, presentCount: Math.max(0, value) }
          : note,
      ),
    );
  }

  const isOut = type === "OUT";
  const canSubmit = isOut ? expenses.length > 0 : employees.length > 0;

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm font-medium text-stone-600">
            Employee {isOut ? "(optional)" : ""}
          </span>
          <select
            name="employeeId"
            required={!isOut}
            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-[#1f7a60]/15"
            defaultValue=""
          >
            <option value="" disabled={!isOut}>
              {isOut ? "No employee — direct expense" : "Select employee"}
            </option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name} — {employee.role}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-stone-600">Date</span>
          <input
            type="date"
            name="date"
            defaultValue={todayISO()}
            required
            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-[#1f7a60]/15"
          />
        </label>
        {isOut ? (
          <label className="space-y-2">
            <span className="text-sm font-medium text-stone-600">Expense</span>
            <select
              name="expenseId"
              required
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-[#1f7a60]/15"
              defaultValue=""
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
        ) : (
          <label className="space-y-2">
            <span className="text-sm font-medium text-stone-600">Remark</span>
            <input
              name="remark"
              placeholder="Optional note"
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-[#1f7a60]/15"
            />
          </label>
        )}
      </div>

      {isOut ? (
        <label className="block space-y-2">
          <span className="text-sm font-medium text-stone-600">Remark</span>
          <input
            name="remark"
            placeholder="What was this expense for"
            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-[#1f7a60]/15"
          />
        </label>
      ) : null}

      <NoteCountBoxes notes={notes} onChange={update} />

      <div className="grid gap-3 rounded-2xl bg-[#0f3d2e] p-5 text-white md:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-emerald-200/70">
            Total amount
          </p>
          <p className="mt-1 text-2xl font-semibold">{formatINR(totalAmount)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-emerald-200/70">
            Notes present
          </p>
          <p className="mt-1 text-2xl font-semibold">{formatNumber(present)}</p>
        </div>
        <button
          type="submit"
          disabled={pending || !canSubmit}
          className={`rounded-xl px-4 py-3 font-semibold text-[#0f3d2e] disabled:opacity-50 ${
            isOut ? "bg-rose-200 hover:bg-rose-100" : "bg-amber-200 hover:bg-amber-100"
          }`}
        >
          {pending
            ? "Saving..."
            : isOut
              ? "Save cash out"
              : "Save cash in"}
        </button>
      </div>

      {!canSubmit ? (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {isOut
            ? "Add an expense from the Expenses page first."
            : "Add an employee from the Employees page first."}
        </p>
      ) : null}

      {state?.error ? (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
