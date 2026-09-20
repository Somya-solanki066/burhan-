import { toggleEmployeeAction } from "@/app/actions/employees";

export function ToggleEmployeeButton({
  id,
  isActive,
}: {
  id: string;
  isActive: boolean;
}) {
  return (
    <form action={toggleEmployeeAction.bind(null, id)}>
      <button
        type="submit"
        className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
          isActive
            ? "bg-rose-50 text-rose-700 hover:bg-rose-100"
            : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
        }`}
      >
        {isActive ? "Disable" : "Enable"}
      </button>
    </form>
  );
}
