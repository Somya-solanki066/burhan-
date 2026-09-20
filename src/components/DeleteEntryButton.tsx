import { deleteCashEntryAction } from "@/app/actions/cash";

export function DeleteEntryButton({ id }: { id: string }) {
  return (
    <form action={deleteCashEntryAction.bind(null, id)}>
      <button
        type="submit"
        className="rounded-lg px-3 py-1.5 text-sm text-rose-700 hover:bg-rose-50"
      >
        Delete
      </button>
    </form>
  );
}
