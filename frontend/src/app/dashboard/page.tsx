"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";

type Wallet = { id: number; name: string; balance: string };
type Txn = { id: number; amount: string; status: string; created_at: string };

const QUICK_LINKS = [
  { href: "/wallets", label: "Wallets" },
  { href: "/transfers", label: "New transfer" },
  { href: "/beneficiaries", label: "Beneficiaries" },
  { href: "/statements", label: "Statements" },
  { href: "/disputes", label: "Disputes" },
  { href: "/transactions", label: "Transactions" },
];

export default function DashboardPage() {
  const { user, token, ready } = useAuth();
  const router = useRouter();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [txns, setTxns] = useState<Txn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  useEffect(() => {
    if (!token) return;
    let active = true;
    Promise.all([
      api<{ wallets: Wallet[] }>("/api/wallets", { token }),
      api<{ transactions: Txn[] }>("/api/transactions", { token }),
    ])
      .then(([w, t]) => {
        if (!active) return;
        setWallets(w.wallets);
        setTxns(t.transactions);
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [token]);

  if (!ready || !user) {
    return <div className="min-h-screen flex items-center justify-center text-zinc-400">Loading…</div>;
  }

  const total = wallets.reduce((s, w) => s + Number(w.balance), 0);

  return (
    <div className="p-6 sm:p-10 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-800">Welcome back, {user.name.split(" ")[0]}</h1>
          <p className="text-sm text-zinc-500 mt-1">{user.email}</p>
        </div>
        <Link href="/transfers" className="inline-block px-5 py-2.5 rounded-lg bg-indigo-200 text-zinc-800 text-sm font-medium hover:bg-indigo-300 transition-colors text-center">
          New transfer
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5 shadow-sm">
          <p className="text-sm text-zinc-500">Total balance</p>
          <p className="text-2xl font-semibold text-zinc-800 mt-1">${total.toFixed(2)}</p>
          <p className="text-xs text-zinc-400 mt-1">Across {wallets.length} wallet(s)</p>
        </div>
        <div className="rounded-2xl border border-sky-100 bg-sky-50 p-5 shadow-sm">
          <p className="text-sm text-zinc-500">Wallets</p>
          <p className="text-2xl font-semibold text-zinc-800 mt-1">{wallets.length}</p>
          <p className="text-xs text-zinc-400 mt-1">Asset accounts</p>
        </div>
        <div className="rounded-2xl border border-violet-100 bg-violet-50 p-5 shadow-sm">
          <p className="text-sm text-zinc-500">Transactions</p>
          <p className="text-2xl font-semibold text-zinc-800 mt-1">{txns.length}</p>
          <p className="text-xs text-zinc-400 mt-1">Completed transfers</p>
        </div>
        <div className="rounded-2xl border border-pink-100 bg-pink-50 p-5 shadow-sm">
          <p className="text-sm text-zinc-500">Account</p>
          <p className="text-2xl font-semibold text-zinc-800 mt-1 truncate">{user.name.split(" ")[0]}</p>
          <p className="text-xs text-zinc-400 mt-1">Active session</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200/70 bg-white/80 shadow-sm">
          <div className="p-4 border-b border-zinc-100">
            <h2 className="text-lg font-medium text-zinc-800">Recent transactions</h2>
          </div>
          {loading ? (
            <p className="p-4 text-sm text-zinc-400">Loading…</p>
          ) : txns.length === 0 ? (
            <p className="p-4 text-sm text-zinc-400">No transactions yet.</p>
          ) : (
            <div className="divide-y divide-zinc-100">
              {txns.slice(0, 5).map((t) => (
                <div key={t.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-700 truncate">Transfer #{t.id}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">{new Date(t.created_at).toLocaleString()}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium text-zinc-800">${Number(t.amount).toFixed(2)}</p>
                    <p className="text-xs text-emerald-500">{t.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="p-4 border-t border-zinc-100 text-right">
            <Link href="/transactions" className="text-sm font-medium text-[#4F8FE8] hover:underline">View all transactions →</Link>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200/70 bg-white/80 shadow-sm">
          <div className="p-4 border-b border-zinc-100">
            <h2 className="text-lg font-medium text-zinc-800">Quick actions</h2>
          </div>
          <div className="p-2">
            {QUICK_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="block px-3 py-2 rounded-lg text-sm text-zinc-600 hover:bg-zinc-100 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-zinc-400 mt-8">All figures are simulated. No real funds are held or moved.</p>
    </div>
  );
}