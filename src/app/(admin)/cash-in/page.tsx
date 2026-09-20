import { CashForm } from "@/components/CashForm";
import { getActiveEmployees } from "@/lib/queries";

export default async function CashInPage() {
  const employees = await getActiveEmployees();

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-emerald-800">Cash In</p>
        <h1 className="text-3xl font-semibold">Incoming notes</h1>
        <p className="mt-1 text-stone-500">
          Select an employee, then enter how many notes are present.
        </p>
      </header>
      <CashForm type="IN" employees={employees} />
    </div>
  );
}
