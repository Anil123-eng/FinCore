"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";

type Wallet = { id: number; name: string; type: string; currency: string; balance: string };

export default function Wallets() {
  const { token, ready, user } = useAuth();
  const router = useRouter();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  useEffect(() => {
    if (!token) return;
    let active = true;
    api<{ wallets: Wallet[] }>("/api/wallets", { token })
      .then((d) => active && setWallets(d.wallets))
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [token]);

  if (!ready || !user) return <div className="min-h-screen flex items-center justify-center text-zinc-400">Loading…</div>;

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-800">Wallets</h1>
        <p className="text-sm text-zinc-500">Manage your simulated wallets and balances.</p>
      </div>

      {loading ? (
        <p className="text-sm text-zinc-400">Loading…</p>
      ) : wallets.length === 0 ? (
        <p className="text-sm text-zinc-400">No wallets yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {wallets.map((w) => (
            <div key={w.id} className="rounded-2xl border border-orange-100 bg-orange-50 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-medium text-zinc-800">{w.name}</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">#{w.id} · {w.type}</p>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/70 text-zinc-500">{w.currency}</span>
              </div>
              <p className="text-3xl font-semibold text-zinc-800">${Number(w.balance).toFixed(2)}</p>
              <p className="text-xs text-zinc-400 mt-2">Available balance (simulated)</p>
            </div>
          ))}
        </div>
      )}
      <div className="mt-8">
        <a href="/dashboard" className="inline-block px-6 py-3 rounded-lg bg-indigo-200 text-zinc-800 font-medium text-sm hover:bg-indigo-300 transition-colors">Return to Dashboard</a>
      </div>
    </div>
  );
}