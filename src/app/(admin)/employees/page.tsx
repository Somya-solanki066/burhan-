import { EmployeeForm } from "@/components/EmployeeForm";
import { ToggleEmployeeButton } from "@/components/ToggleEmployeeButton";
import { getAllEmployees } from "@/lib/queries";
import { formatDateTime } from "@/lib/dates";

export default async function EmployeesPage() {
  const employees = await getAllEmployees();

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-[#145c47]">Staff</p>
        <h1 className="text-3xl font-semibold">Employees</h1>
        <p className="mt-1 text-stone-500">
          Add a new employee. They will appear in the cash in and cash out forms.
        </p>
      </header>

      <EmployeeForm />

      <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#f7f3ec] text-stone-500">
            <tr>
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Phone</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Entries</th>
              <th className="px-5 py-3 font-medium">Added</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-stone-500">
                  No employees yet. Add one using the form above.
                </td>
              </tr>
            ) : (
              employees.map((employee) => (
                <tr key={employee.id} className="border-t border-stone-100">
                  <td className="px-5 py-4 font-medium">{employee.name}</td>
                  <td className="px-5 py-4 text-stone-500">{employee.phone || "—"}</td>
                  <td className="px-5 py-4">{employee.role}</td>
                  <td className="px-5 py-4">{employee._count.entries}</td>
                  <td className="px-5 py-4 text-stone-500">
                    {formatDateTime(employee.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        employee.isActive
                          ? "bg-emerald-50 text-emerald-800"
                          : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      {employee.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <ToggleEmployeeButton id={employee.id} isActive={employee.isActive} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
