export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold text-gray-950 dark:text-white">
        You are offline
      </h1>
      <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
        PeterPlate needs a network connection for fresh menus, account data, and
        meal tracking. Reconnect and reload to continue.
      </p>
    </main>
  );
}
