"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";

type Txn = { id: number; from_account: number; to_account: number; amount: string; status: string; created_at: string };

export default function Transactions() {
  const { token, ready, user } = useAuth();
  const router = useRouter();
  const [txns, setTxns] = useState<Txn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  useEffect(() => {
    if (!token) return;
    let active = true;
    api<{ transactions: Txn[] }>("/api/transactions", { token })
      .then((d) => active && setTxns(d.transactions))
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [token]);

  if (!ready || !user) return <div className="min-h-screen flex items-center justify-center text-zinc-400">Loading…</div>;

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-800">Transaction History</h1>
        <p className="text-sm text-zinc-500">Your simulated transfer records.</p>
      </div>

      <div className="rounded-2xl border border-sky-100 bg-sky-50 shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-4 text-sm text-zinc-400">Loading…</p>
        ) : txns.length === 0 ? (
          <p className="p-4 text-sm text-zinc-400">No transactions yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-white/60 text-zinc-500">
              <tr>
                <th className="text-left px-4 py-2 font-medium">ID</th>
                <th className="text-left px-4 py-2 font-medium">From → To</th>
                <th className="text-left px-4 py-2 font-medium">Amount</th>
                <th className="text-left px-4 py-2 font-medium">Status</th>
                <th className="text-left px-4 py-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/60">
              {txns.map((t) => (
                <tr key={t.id}>
                  <td className="px-4 py-2 text-zinc-700">#{t.id}</td>
                  <td className="px-4 py-2 text-zinc-700">{t.from_account} → {t.to_account}</td>
                  <td className="px-4 py-2 text-zinc-800">${Number(t.amount).toFixed(2)}</td>
                  <td className="px-4 py-2 text-emerald-600">{t.status}</td>
                  <td className="px-4 py-2 text-zinc-500">{new Date(t.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}