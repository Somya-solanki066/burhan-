import { UserNoteForm } from "@/components/UserNoteForm";
import { getActiveEmployees } from "@/lib/queries";

export default async function NotesPage() {
  const employees = await getActiveEmployees();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Enter notes</h1>
        <p className="mt-1 text-stone-500">
          Select an employee, then fill how many notes are present and missing.
        </p>
      </header>
      <UserNoteForm employees={employees} />
    </div>
  );
}
