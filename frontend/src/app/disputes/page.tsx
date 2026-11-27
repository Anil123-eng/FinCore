"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";

type Dispute = { id: number; transaction_id: string; reason: string; status: string };

export default function Disputes() {
  const { token, ready, user } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Dispute[]>([]);
  const [transactionId, setTransactionId] = useState("");
  const [reason, setReason] = useState("");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  if (!ready || !user) return <div className="min-h-screen flex items-center justify-center text-zinc-400">Loading…</div>;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      const r = await api<{ dispute: Dispute }>("/api/disputes", {
        method: "POST",
        token: token!,
        body: JSON.stringify({ transactionId, reason }),
      });
      setItems((prev) => [r.dispute, ...prev]);
      setTransactionId("");
      setReason("");
    } catch (e) {
      setErr((e as Error).message);
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-800">Disputes</h1>
        <p className="text-sm text-zinc-500">Raise and track disputes for simulated transactions.</p>
      </div>

      <form onSubmit={submit} className="rounded-2xl border border-pink-100 bg-pink-50 p-6 space-y-4 shadow-sm mb-6">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Transaction ID</label>
          <input value={transactionId} onChange={(e) => setTransactionId(e.target.value)} required className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800" placeholder="e.g. 1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Reason</label>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} required className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800" rows={3} placeholder="Describe the issue" />
        </div>
        {err && <p className="text-sm text-rose-500">{err}</p>}
        <button type="submit" className="rounded-lg bg-pink-200 text-zinc-800 px-4 py-2 text-sm font-medium hover:bg-pink-300 transition-colors">Submit dispute</button>
      </form>

      <div className="rounded-2xl border border-zinc-200/70 bg-white/80 shadow-sm">
        {items.length === 0 ? (
          <p className="p-4 text-sm text-zinc-400">No disputes raised in this session.</p>
        ) : (
          <div className="divide-y divide-zinc-100">
            {items.map((d) => (
              <div key={d.id} className="p-4">
                <p className="text-sm font-medium text-zinc-700">Dispute #{d.id} · Txn {d.transaction_id}</p>
                <p className="text-sm text-zinc-500">{d.reason}</p>
                <p className="text-xs text-amber-600 mt-1">{d.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}