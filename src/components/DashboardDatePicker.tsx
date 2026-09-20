"use client";

import { useRouter } from "next/navigation";

export function DashboardDatePicker({ date }: { date: string }) {
  const router = useRouter();

  return (
    <input
      type="date"
      value={date}
      onChange={(event) => {
        const next = event.target.value || date;
        router.push(`/dashboard?date=${next}`);
      }}
      className="rounded-xl border border-stone-200 bg-white px-4 py-2.5"
    />
  );
}
