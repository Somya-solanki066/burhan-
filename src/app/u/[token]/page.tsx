import { UserLoginForm } from "@/components/UserLoginForm";
import { getUserByLinkToken } from "@/lib/queries";

export default async function UniqueUserLoginPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const user = await getUserByLinkToken(token);

  if (!user || !user.isActive || !user.linkToken) {
    return (
      <main className="flex min-h-full items-center justify-center p-6">
        <div className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-8 text-center">
          <h1 className="text-2xl font-semibold">Invalid link</h1>
          <p className="mt-2 text-sm text-stone-500">
            This login link is expired or incorrect. Ask admin for a new unique link.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-full items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium text-[#145c47]">Note Entry</p>
        <h1 className="mt-2 text-3xl font-semibold">User login</h1>
        <p className="mt-2 mb-8 text-sm text-stone-500">
          This link is unique to you. Enter the password set by admin.
        </p>
        <UserLoginForm token={user.linkToken} userName={user.name} />
      </div>
    </main>
  );
}
