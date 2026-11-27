"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";

type Wallet = { id: number; name: string; balance: string };

export default function Transfers() {
  const { token, ready, user } = useAuth();
  const router = useRouter();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  useEffect(() => {
    if (!token) return;
    let active = true;
    api<{ wallets: Wallet[] }>("/api/wallets", { token })
      .then((d) => active && setWallets(d.wallets))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [token]);

  if (!ready || !user) return <div className="min-h-screen flex items-center justify-center text-zinc-400">Loading…</div>;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    try {
      const r = await api<{ transfer: { id: number } }>("/api/transfers", {
        method: "POST",
        token: token!,
        body: JSON.stringify({ from: Number(from), to: Number(to), amount: Number(amount) }),
      });
      setMsg(`Transfer #${r.transfer.id} completed.`);
      setAmount("");
    } catch (e) {
      setErr((e as Error).message);
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-800">Transfers</h1>
        <p className="text-sm text-zinc-500">Move simulated funds between your wallets.</p>
      </div>

      <form onSubmit={submit} className="rounded-2xl border border-violet-100 bg-violet-50 p-6 space-y-4 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">From wallet</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)} required className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800">
            <option value="">Select…</option>
            {wallets.map((w) => (
              <option key={w.id} value={w.id}>{w.name} (bal ${Number(w.balance).toFixed(2)})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">To wallet</label>
          <select value={to} onChange={(e) => setTo(e.target.value)} required className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800">
            <option value="">Select…</option>
            {wallets.map((w) => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Amount</label>
          <input type="number" step="0.01" min="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800" placeholder="0.00" />
        </div>

        {err && <p className="text-sm text-rose-500">{err}</p>}
        {msg && <p className="text-sm text-emerald-600">{msg}</p>}

        <button type="submit" className="w-full rounded-lg bg-violet-200 text-zinc-800 py-2 text-sm font-medium hover:bg-violet-300 transition-colors">
          Send transfer
        </button>
      </form>
    </div>
  );
}