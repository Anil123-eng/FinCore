import Link from "next/link";

const CARDS = [
  { label: "Suspicious Activity", value: "None detected", bg: "bg-yellow-50", border: "border-yellow-100" },
  { label: "Recent Transfers Reviewed", value: "0 this period", bg: "bg-sky-50", border: "border-sky-100" },
  { label: "Dispute Cases Open", value: "0", bg: "bg-pink-50", border: "border-pink-100" },
  { label: "Reconciliation Status", value: "Balanced", bg: "bg-emerald-50", border: "border-emerald-100" },
];

export default function Operations() {
  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-800">Operations</h1>
        <p className="text-sm text-zinc-500">
          Operations view for investigating suspicious activity and reconciling
          payment-provider events. Simulated only.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {CARDS.map((c) => (
          <div key={c.label} className={`rounded-2xl border ${c.border} ${c.bg} p-5 shadow-sm`}>
            <p className="text-sm text-zinc-500">{c.label}</p>
            <p className="text-xl font-semibold text-zinc-800 mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Link href="/dashboard" className="inline-block px-6 py-3 rounded-lg bg-indigo-200 text-zinc-800 font-medium text-sm hover:bg-indigo-300 transition-colors">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}