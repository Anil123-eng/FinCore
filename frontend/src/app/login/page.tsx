"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const { user, ready, login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace("/dashboard");
  }, [ready, user, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const result = await login(email, password);
    setBusy(false);
    if (result.ok) router.push("/dashboard");
    else setError(result.error ?? "Unable to log in.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-sky-50 via-indigo-50 to-emerald-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-md bg-sky-100 flex items-center justify-center font-semibold text-sky-700">
              F
            </div>
            <span className="text-2xl font-medium tracking-tight">
              <span className="text-[#4F8FE8]">FIN</span>
              <span className="text-[#9275D8]">CORE</span>
            </span>
          </Link>
          <h1 className="text-2xl font-semibold text-zinc-800">Welcome back</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Log in to access your dashboard.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur border border-white/60 rounded-2xl p-6 space-y-4 shadow-sm"
        >
          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 outline-none focus:ring-2 focus:ring-sky-200"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 outline-none focus:ring-2 focus:ring-sky-200"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-rose-500">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-sky-200 text-zinc-800 py-2 text-sm font-medium hover:bg-sky-300 transition-colors disabled:opacity-60"
          >
            {busy ? "Logging in…" : "Log in"}
          </button>

          <p className="text-sm text-center text-zinc-500">
            No account?{" "}
            <Link href="/register" className="font-medium text-[#4F8FE8] hover:underline">
              Create one
            </Link>
          </p>
        </form>

        <p className="text-center text-xs text-zinc-400 mt-6">
          Secured by the FinCore API. Simulated funds only.
        </p>
      </div>
    </div>
  );
}