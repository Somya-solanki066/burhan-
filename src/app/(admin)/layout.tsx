import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getSession } from "@/lib/auth";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    redirect(session?.role === "user" ? "/notes" : "/");
  }

  return (
    <div className="flex min-h-full">
      <div className="hidden md:block">
        <Sidebar adminName={session.name} />
      </div>
      <div className="flex min-h-full min-w-0 flex-1 flex-col">
        <MobileNav adminName={session.name} />
        <main className="min-w-0 flex-1 overflow-auto p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
