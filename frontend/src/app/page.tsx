"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

const FEATURES = [
  { title: "Wallets", description: "Create and manage multiple simulated wallets with real-time balances.", bg: "bg-orange-50", border: "border-orange-100" },
  { title: "Transfers", description: "Move simulated funds between wallets and beneficiaries in seconds.", bg: "bg-violet-50", border: "border-violet-100" },
  { title: "Beneficiaries", description: "Save and manage the accounts you transact with most.", bg: "bg-sky-50", border: "border-sky-100" },
  { title: "Statements", description: "Review clear, itemized statements for every period you need.", bg: "bg-emerald-50", border: "border-emerald-100" },
  { title: "Disputes", description: "Raise and track disputes with a transparent review workflow.", bg: "bg-pink-50", border: "border-pink-100" },
  { title: "Operations", description: "Investigate suspicious activity and reconcile provider events.", bg: "bg-yellow-50", border: "border-yellow-100" },
];

export default function LandingPage() {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && user) router.replace("/dashboard");
  }, [ready, user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-indigo-50 to-emerald-50">
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-md bg-sky-100 flex items-center justify-center font-semibold text-sky-700">
            F
          </div>
          <span className="text-2xl font-medium tracking-tight">
            <span className="text-[#4F8FE8]">FIN</span>
            <span className="text-[#9275D8]">CORE</span>
          </span>
        </div>
        <nav className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
            Log in
          </Link>
          <Link href="/register" className="text-sm font-medium px-4 py-2 rounded-lg bg-emerald-200 text-zinc-800 hover:bg-emerald-300 transition-colors">
            Get started
          </Link>
        </nav>
      </header>

      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 text-center">
        <span className="inline-block text-xs font-medium uppercase tracking-wider text-zinc-500 bg-white/70 border border-white/60 rounded-full px-3 py-1 mb-6">
          Simulated finance platform
        </span>
        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-zinc-800 mb-6">
          Your digital wallet,
          <br className="sm:hidden" /> ledger and payments in one place.
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-zinc-500 mb-10">
          FinCore lets you create wallets, manage beneficiaries, transfer simulated funds, review statements, and raise disputes — all from a single, clean dashboard. Educational simulation only. No real funds or banking credentials are used.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/register" className="inline-block px-8 py-3 rounded-lg bg-emerald-200 text-zinc-800 font-medium hover:bg-emerald-300 transition-colors">
            Create your account
          </Link>
          <Link href="/login" className="inline-block px-8 py-3 rounded-lg bg-sky-200 text-zinc-800 font-medium hover:bg-sky-300 transition-colors">
            Log in
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className={`rounded-2xl border ${f.border} ${f.bg} p-6 shadow-sm`}>
              <h3 className="text-lg font-semibold text-zinc-800 mb-2">{f.title}</h3>
              <p className="text-sm text-zinc-500">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/60 py-8 text-center text-sm text-zinc-400">
        FinCore is an educational simulation. No real money is moved.
      </footer>
    </div>
  );
}