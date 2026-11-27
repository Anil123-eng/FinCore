import Image from "next/image";

export default function Beneficiaries() {
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
          Beneficiaries
        </h1>

        <p className="text-zinc-600 dark:text-zinc-400 mb-8 text-center max-w-2xl">
          Manage beneficiary accounts for transfers and payments. No real customer information
          or banking credentials are used.
        </p>

        <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm dark:bg-zinc-800 border border-zinc-300/50 mb-8">
          <div className="p-4 border-b border-zinc-200/50 dark:border-zinc-700/50">
            <h2 className="text-lg font-medium text-zinc-800 dark:text-zinc-100">
              Beneficiary List
            </h2>
          </div>
          <div className="p-4 space-y-4 text-sm">
            <p className="text-zinc-400 dark:text-zinc-400">
              No beneficiaries added yet
            </p>
            <p className="text-zinc-400 dark:text-zinc-400">
              <a href="/"
                className="underline text-zinc-500 dark:text-zinc-400 cursor-pointer">
                Return to Dashboard
              </a>
            </p>
            <p className="text-zinc-400 dark:text-zinc-400">
              <a href="/wallets"
                className="underline text-zinc-500 dark:text-zinc-400 cursor-pointer">
                Add wallets first
              </a>
            </p>
          </div>
        </div>

        <div className="w-full max-w-2xl text-center">
          <a href="/"
            className="inline-block px-6 py-3 rounded-md bg-zinc-600 text-white font-medium text-sm hover:bg-zinc-500 transition-colors">
            Return to Dashboard
          </a>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Manage beneficiary accounts for transfers and payments.
          </p>
        </div>
      </div>
    </div>
  );
}