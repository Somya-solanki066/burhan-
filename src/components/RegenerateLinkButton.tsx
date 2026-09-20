import { regenerateUserLinkAction } from "@/app/actions/users";

export function RegenerateLinkButton({
  userId,
  label = "New link",
  className = "rounded-lg px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-100",
}: {
  userId: string;
  label?: string;
  className?: string;
}) {
  return (
    <form action={regenerateUserLinkAction.bind(null, userId)}>
      <button type="submit" className={className}>
        {label}
      </button>
    </form>
  );
}
