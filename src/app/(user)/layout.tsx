import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";

export default async function UserLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== "user") {
    redirect("/u");
  }

  return (
    <div className="min-h-full">
      <header className="flex items-center justify-between border-b border-stone-200 bg-[#0f3d2e] px-4 py-4 text-white md:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/70">Burhan</p>
          <h1 className="text-lg font-semibold">Note Entry</h1>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm text-emerald-100/80">{session.name}</p>
          <form action={logoutAction}>
            <button className="rounded-lg border border-white/15 px-3 py-1.5 text-sm hover:bg-white/10">
              Logout
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-5xl p-4 md:p-8">{children}</main>
    </div>
  );
}
