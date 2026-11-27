"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";

type Statement = {
  statement: {
    period: string;
    closingBalance: string;
    transactions: { id: number; amount: string; status: string; created_at: string }[];
  };
};

export default function Statements() {
  const { token, ready, user } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<Statement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  useEffect(() => {
    if (!token) return;
    let active = true;
    api<Statement>("/api/statements", { token })
      .then((d) => active && setData(d))
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [token]);

  if (!ready || !user) return <div className="min-h-screen flex items-center justify-center text-zinc-400">Loading…</div>;

  return (
    <div className="p-6 sm:p-10 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-800">Statements</h1>
        <p className="text-sm text-zinc-500">Your current simulated statement.</p>
      </div>

      {loading ? (
        <p className="text-sm text-zinc-400">Loading…</p>
      ) : !data ? (
        <p className="text-sm text-zinc-400">No statement available.</p>
      ) : (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-zinc-800">{data.statement.period}</h2>
            <span className="text-sm text-zinc-500">Closing balance</span>
          </div>
          <p className="text-3xl font-semibold text-zinc-800 mb-6">${Number(data.statement.closingBalance).toFixed(2)}</p>
          <div className="divide-y divide-white/60">
            {data.statement.transactions.length === 0 ? (
              <p className="text-sm text-zinc-400 py-2">No transactions in this period.</p>
            ) : (
              data.statement.transactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between py-2">
                  <span className="text-sm text-zinc-600">Transfer #{t.id}</span>
                  <span className="text-sm text-zinc-800">${Number(t.amount).toFixed(2)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}