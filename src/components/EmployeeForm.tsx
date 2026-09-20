"use client";

import { useActionState } from "react";
import { createEmployeeAction } from "@/app/actions/employees";

const initial = { error: "", success: "" };

export function EmployeeForm() {
  const [state, action, pending] = useActionState(createEmployeeAction, initial);

  return (
    <form action={action} className="grid gap-4 rounded-2xl border border-stone-200 bg-white p-5 md:grid-cols-4">
      <label className="space-y-2">
        <span className="text-sm font-medium text-stone-600">Name</span>
        <input
          name="name"
          required
          placeholder="Employee name"
          className="w-full rounded-xl border border-stone-200 px-4 py-3 outline-none focus:ring-4 focus:ring-[#1f7a60]/15"
        />
      </label>
      <label className="space-y-2">
        <span className="text-sm font-medium text-stone-600">Phone</span>
        <input
          name="phone"
          placeholder="Optional"
          className="w-full rounded-xl border border-stone-200 px-4 py-3 outline-none focus:ring-4 focus:ring-[#1f7a60]/15"
        />
      </label>
      <label className="space-y-2">
        <span className="text-sm font-medium text-stone-600">Role</span>
        <input
          name="role"
          defaultValue="Cashier"
          className="w-full rounded-xl border border-stone-200 px-4 py-3 outline-none focus:ring-4 focus:ring-[#1f7a60]/15"
        />
      </label>
      <div className="flex flex-col justify-end gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-[#145c47] px-4 py-3 font-semibold text-white hover:bg-[#0f3d2e] disabled:opacity-60"
        >
          {pending ? "Adding..." : "Add Employee"}
        </button>
        {state?.error ? <p className="text-sm text-rose-700">{state.error}</p> : null}
        {state?.success ? <p className="text-sm text-[#145c47]">{state.success}</p> : null}
      </div>
    </form>
  );
}
