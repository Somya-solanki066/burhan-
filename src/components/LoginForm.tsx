"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/actions/auth";

const initial = { error: "" };

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initial);

  return (
    <form action={action} className="space-y-5">
      <label className="block space-y-2">
        <span className="text-sm font-medium text-stone-600">Username</span>
        <input
          name="username"
          autoComplete="username"
          required
          className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-stone-900 outline-none ring-[#1f7a60]/20 focus:ring-4"
          placeholder="admin"
        />
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-stone-600">Password</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-stone-900 outline-none ring-[#1f7a60]/20 focus:ring-4"
          placeholder="••••••••"
        />
      </label>
      {state?.error ? (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-[#145c47] px-4 py-3 font-semibold text-white transition hover:bg-[#0f3d2e] disabled:opacity-60"
      >
        {pending ? "Checking..." : "Admin Login"}
      </button>
    </form>
  );
}
