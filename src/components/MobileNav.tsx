"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/cash-in", label: "In" },
  { href: "/cash-out", label: "Out" },
  { href: "/expenses", label: "Expenses" },
  { href: "/employees", label: "Staff" },
  { href: "/entries", label: "Entries" },
  { href: "/users", label: "Users" },
];

export function MobileNav({ adminName }: { adminName: string }) {
  const pathname = usePathname();

  return (
    <div className="border-b border-stone-200 bg-[#0f3d2e] text-white md:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <p className="text-sm font-semibold">Burhan Cash</p>
          <p className="text-xs text-emerald-100/70">{adminName}</p>
        </div>
        <form action={logoutAction}>
          <button className="text-sm text-emerald-100">Logout</button>
        </form>
      </div>
      <nav className="flex overflow-x-auto px-2 pb-2">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`mr-1 whitespace-nowrap rounded-lg px-3 py-2 text-sm ${
                active ? "bg-white text-[#0f3d2e]" : "text-emerald-50/80"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
