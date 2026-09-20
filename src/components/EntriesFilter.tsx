"use client";

import { useRouter } from "next/navigation";

type Employee = { id: string; name: string };

export function EntriesFilter({
  date,
  type,
  employeeId,
  employees,
}: {
  date: string;
  type: string;
  employeeId: string;
  employees: Employee[];
}) {
  const router = useRouter();

  function apply(next: { date?: string; type?: string; employeeId?: string }) {
    const params = new URLSearchParams();
    const nextDate = next.date ?? date;
    const nextType = next.type ?? type;
    const nextEmployee = next.employeeId ?? employeeId;
    if (nextDate) params.set("date", nextDate);
    if (nextType) params.set("type", nextType);
    if (nextEmployee) params.set("employeeId", nextEmployee);
    router.push(`/entries?${params.toString()}`);
  }

  return (
    <div className="grid gap-3 rounded-2xl border border-stone-200 bg-white p-4 md:grid-cols-3">
      <input
        type="date"
        value={date}
        onChange={(event) => apply({ date: event.target.value })}
        className="rounded-xl border border-stone-200 px-4 py-3"
      />
      <select
        value={type}
        onChange={(event) => apply({ type: event.target.value })}
        className="rounded-xl border border-stone-200 px-4 py-3"
      >
        <option value="">In + Out</option>
        <option value="IN">Cash In</option>
        <option value="OUT">Cash Out</option>
      </select>
      <select
        value={employeeId}
        onChange={(event) => apply({ employeeId: event.target.value })}
        className="rounded-xl border border-stone-200 px-4 py-3"
      >
        <option value="">All employees</option>
        {employees.map((employee) => (
          <option key={employee.id} value={employee.id}>
            {employee.name}
          </option>
        ))}
      </select>
    </div>
  );
}
