import { UserForm } from "@/components/UserForm";
import { ResetUserPasswordForm } from "@/components/ResetUserPasswordForm";
import { ToggleUserButton } from "@/components/ToggleUserButton";
import { CopyUserLink } from "@/components/CopyUserLink";
import { RegenerateLinkButton } from "@/components/RegenerateLinkButton";
import { getAllUsers } from "@/lib/queries";
import { formatDateTime } from "@/lib/dates";

export default async function UsersPage() {
  const users = await getAllUsers();

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-[#145c47]">Access</p>
        <h1 className="text-3xl font-semibold">Users</h1>
        <p className="mt-1 text-stone-500">
          Each user gets a unique login link. Set their password, then copy the link.
        </p>
      </header>

      <UserForm />

      <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#f7f3ec] text-stone-500">
            <tr>
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Login ID</th>
              <th className="px-5 py-3 font-medium">Password</th>
              <th className="px-5 py-3 font-medium">Unique link</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-stone-500">
                  No users yet. Create one to generate a unique link.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-t border-stone-100">
                  <td className="px-5 py-4 font-medium">{user.name}</td>
                  <td className="px-5 py-4">{user.username}</td>
                  <td className="px-5 py-4">
                    <ResetUserPasswordForm userId={user.id} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {user.linkToken ? (
                        <>
                          <CopyUserLink token={user.linkToken} label="Copy link" />
                          <RegenerateLinkButton userId={user.id} />
                        </>
                      ) : (
                        <RegenerateLinkButton userId={user.id} label="Generate unique link" />
                      )}
                    </div>
                    {user.linkToken ? (
                      <p className="mt-1 max-w-[220px] truncate text-xs text-stone-400">
                        /u/{user.linkToken}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        user.isActive
                          ? "bg-emerald-50 text-emerald-800"
                          : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      {user.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <ToggleUserButton id={user.id} isActive={user.isActive} />
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
