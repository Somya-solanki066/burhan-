"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/notes", label: "Cash In" },
  { href: "/notes/out", label: "Cash Out" },
];

export function UserNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 rounded-xl bg-white/10 p-1">
      {links.map((link) => {
        const active =
          link.href === "/notes"
            ? pathname === "/notes"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              active ? "bg-white text-[#145c47]" : "text-white hover:bg-white/10"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
