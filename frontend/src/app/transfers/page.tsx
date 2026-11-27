import Image from "next/image";

export default function Transfers() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Image
        src="/next.svg"
        alt="FinCore logo"
        className="h-16 w-auto mx-auto dark:invert mb-8"
        width={48}
        height={28}
        priority
      />

      <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-6">
          Transfers
        </h1>

        <p className="text-zinc-600 dark:text-zinc-400 mb-8 text-center max-w-2xl">
          Simulated transfer interface between wallets. All transfers are simulated
          for demonstration purposes only.
        </p>

        <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm dark:bg-zinc-800 border border-zinc-300/50 mb-8">
          <div className="p-4 border-b border-zinc-200/50 dark:border-zinc-700/50">
            <h2 className="text-lg font-medium text-zinc-800 dark:text-zinc-100">
              Transfer Summary
            </h2>
          </div>
          <div className="p-4 space-y-3">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              <span className="font-medium">From:</span>
              <span className="font-medium text-zinc-600 dark:text-zinc-400">Wallet 1</span>
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              <span className="font-medium">To:</span>
              <span className="font-medium text-zinc-600 dark:text-zinc-400">Wallet 2</span>
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              <span className="font-medium">Amount:</span>
              <span className="font-medium text-zinc-600 dark:text-zinc-400">(simulated)</span>
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              <span className="font-medium">Status:</span>
              <span className="font-medium text-zinc-600 dark:text-zinc-400">Pending</span>
            </p>
          </div>
        </div>

        <div className="w-full max-w-2xl text-center">
          <a href="/"
            className="inline-block px-6 py-3 rounded-md bg-zinc-600 text-white font-medium text-sm hover:bg-zinc-500 transition-colors">
            Return to Dashboard
          </a>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Simulated transfer interface. No real funds moved.
          </p>
        </div>
      </div>
    </div>
  );
}