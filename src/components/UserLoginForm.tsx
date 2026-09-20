"use client";

import { useActionState } from "react";
import { userLoginAction } from "@/app/actions/auth";

const initial = { error: "" };

export function UserLoginForm({
  token,
  userName,
}: {
  token: string;
  userName: string;
}) {
  const [state, action, pending] = useActionState(userLoginAction, initial);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="token" value={token} />
      <div className="rounded-xl bg-[#f7f3ec] px-4 py-3">
        <p className="text-xs text-stone-500">Login for</p>
        <p className="font-semibold">{userName}</p>
      </div>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-stone-600">Password</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-stone-900 outline-none ring-[#1f7a60]/20 focus:ring-4"
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
        {pending ? "Checking..." : "Login"}
      </button>
    </form>
  );
}
