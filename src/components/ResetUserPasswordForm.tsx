"use client";

import { useActionState } from "react";
import { updateUserPasswordAction } from "@/app/actions/users";

const initial = { error: "", success: "" };

export function ResetUserPasswordForm({ userId }: { userId: string }) {
  const [state, action, pending] = useActionState(updateUserPasswordAction, initial);

  return (
    <form action={action} className="flex items-center gap-2">
      <input type="hidden" name="id" value={userId} />
      <input
        name="password"
        type="text"
        required
        placeholder="New password"
        className="w-36 rounded-lg border border-stone-200 px-3 py-1.5 text-sm"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[#f7f3ec] px-3 py-1.5 text-sm font-medium hover:bg-stone-200"
      >
        {pending ? "..." : "Set"}
      </button>
      {state?.error ? <span className="text-xs text-rose-700">{state.error}</span> : null}
      {state?.success ? <span className="text-xs text-emerald-700">{state.success}</span> : null}
    </form>
  );
}
