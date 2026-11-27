"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";

type Beneficiary = { id: number; name: string; account: string };

export default function Beneficiaries() {
  const { token, ready, user } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Beneficiary[]>([]);
  const [name, setName] = useState("");
  const [account, setAccount] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  useEffect(() => {
    if (!token) return;
    let active = true;
    api<{ beneficiaries: Beneficiary[] }>("/api/beneficiaries", { token })
      .then((d) => active && setItems(d.beneficiaries))
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [token]);

  if (!ready || !user) return <div className="min-h-screen flex items-center justify-center text-zinc-400">Loading…</div>;

  const add = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      const r = await api<{ beneficiary: Beneficiary }>("/api/beneficiaries", {
        method: "POST",
        token: token!,
        body: JSON.stringify({ name, account }),
      });
      setItems((prev) => [...prev, r.beneficiary]);
      setName("");
      setAccount("");
    } catch (e) {
      setErr((e as Error).message);
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-800">Beneficiaries</h1>
        <p className="text-sm text-zinc-500">Manage the accounts you transact with.</p>
      </div>

      <form onSubmit={add} className="rounded-2xl border border-sky-100 bg-sky-50 p-6 space-y-4 shadow-sm mb-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800" placeholder="Beneficiary name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Account</label>
            <input value={account} onChange={(e) => setAccount(e.target.value)} required className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800" placeholder="ACC-001" />
          </div>
        </div>
        {err && <p className="text-sm text-rose-500">{err}</p>}
        <button type="submit" className="rounded-lg bg-sky-200 text-zinc-800 px-4 py-2 text-sm font-medium hover:bg-sky-300 transition-colors">Add beneficiary</button>
      </form>

      <div className="rounded-2xl border border-zinc-200/70 bg-white/80 shadow-sm">
        {loading ? (
          <p className="p-4 text-sm text-zinc-400">Loading…</p>
        ) : items.length === 0 ? (
          <p className="p-4 text-sm text-zinc-400">No beneficiaries added yet.</p>
        ) : (
          <div className="divide-y divide-zinc-100">
            {items.map((b) => (
              <div key={b.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-700">{b.name}</p>
                  <p className="text-xs text-zinc-400">{b.account}</p>
                </div>
                <span className="text-xs text-zinc-400">#{b.id}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}