export default function UserLoginIndexPage() {
  return (
    <main className="flex min-h-full items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-8 text-center">
        <h1 className="text-2xl font-semibold">Unique login required</h1>
        <p className="mt-2 text-sm text-stone-500">
          Use the unique link shared by admin. A shared login page is not available.
        </p>
      </div>
    </main>
  );
}
