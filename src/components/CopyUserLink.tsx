"use client";

import { useState } from "react";

export function CopyUserLink({
  token,
  label = "Copy unique link",
}: {
  token: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    const url = `${window.location.origin}/u/${token}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copyLink}
      className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#145c47] hover:bg-emerald-50"
    >
      {copied ? "Link copied" : label}
    </button>
  );
}
