"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";

const links = [
  { href: "/dashboard", label: "Dashboard", hint: "Today's totals" },
  { href: "/cash-in", label: "Cash In", hint: "Incoming notes" },
  { href: "/cash-out", label: "Cash Out", hint: "Expenses" },
  { href: "/expenses", label: "Expenses", hint: "Add expense types" },
  { href: "/employees", label: "Employees", hint: "Add staff" },
  { href: "/entries", label: "Entries", hint: "All records" },
  { href: "/users", label: "Users", hint: "Login ID / password" },
];

export function Sidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-[#0f3d2e] text-emerald-50">
      <div className="border-b border-white/10 px-6 py-6">
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-200/70">
          Burhan
        </p>
        <h1 className="mt-1 text-xl font-semibold">Cash Admin</h1>
        <p className="mt-2 text-sm text-emerald-100/70">{adminName}</p>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-xl px-4 py-3 transition ${
                active
                  ? "bg-white text-[#0f3d2e]"
                  : "text-emerald-50/80 hover:bg-white/10"
              }`}
            >
              <span className="block font-medium">{link.label}</span>
              <span className={`text-xs ${active ? "text-[#0f3d2e]/70" : "text-emerald-100/50"}`}>
                {link.hint}
              </span>
            </Link>
          );
        })}
      </nav>
      <form action={logoutAction} className="border-t border-white/10 p-4">
        <button
          type="submit"
          className="w-full rounded-xl border border-white/15 px-4 py-2.5 text-sm text-emerald-50/90 hover:bg-white/10"
        >
          Logout
        </button>
      </form>
    </aside>
  );
}
