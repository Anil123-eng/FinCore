"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/wallets", label: "Wallets" },
  { href: "/beneficiaries", label: "Beneficiaries" },
  { href: "/disputes", label: "Disputes" },
  { href: "/transfers", label: "Transfers" },
  { href: "/transactions", label: "Transactions" },
  { href: "/statements", label: "Statements" },
];

const PUBLIC_ROUTES = ["/", "/login", "/register"];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, ready, logout } = useAuth();

  const isPublic = PUBLIC_ROUTES.includes(pathname);

  if (!ready || !user || isPublic) return null;

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <aside className="flex flex-col w-64 shrink-0 bg-white/70 backdrop-blur border-r border-zinc-200/70 min-h-screen p-4">
      <div className="flex items-center justify-between mb-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-sky-100 flex items-center justify-center text-sm font-medium text-sky-700">
            F
          </div>
          <span className="text-xl font-medium tracking-tight">
            <span className="text-[#4F8FE8]">FIN</span>
            <span className="text-[#9275D8]">CORE</span>
          </span>
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="p-1 rounded-md text-sm text-zinc-500 hover:bg-rose-50 hover:text-rose-500 transition-colors"
        >
          Logout
        </button>
      </div>

      <nav className="space-y-1.5">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/dashboard" && pathname.startsWith("/dashboard"));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-zinc-200/70">
        <p className="text-xs text-zinc-400 truncate">
          Signed in as
          <br />
          <span className="text-zinc-600">{user?.name}</span>
        </p>
      </div>
    </aside>
  );
}