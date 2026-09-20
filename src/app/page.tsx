import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="grid min-h-full lg:grid-cols-2">
      <section className="hidden bg-[#0f3d2e] p-12 text-emerald-50 lg:flex lg:flex-col lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-200/70">
            Burhan
          </p>
          <h1 className="mt-6 max-w-md text-5xl font-semibold leading-tight">
            Daily cash in and cash out, note by note.
          </h1>
        </div>
        <ul className="max-w-md space-y-3 text-emerald-100/80">
          <li>500, 200, 100, 50, 20, 10, 1 — count every denomination</li>
          <li>How many notes you have, and how many are missing</li>
          <li>Today's totals on the dashboard, including in, out, and expenses</li>
        </ul>
      </section>
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-medium text-[#145c47]">Admin Panel</p>
          <h2 className="mt-2 text-3xl font-semibold">Login</h2>
          <p className="mt-2 mb-8 text-sm text-stone-500">
            Default: admin / admin123
          </p>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
