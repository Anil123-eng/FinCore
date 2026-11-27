"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, type ApiUser } from "@/lib/api";

type Session = { user: ApiUser; token: string };

type AuthContextValue = {
  user: ApiUser | null;
  token: string | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
};

const STORAGE_KEY = "fincore.session";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setSession(JSON.parse(raw) as Session);
      } catch {
        // ignore malformed session
      }
      setReady(true);
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const data = await api<{ customer: ApiUser; token: string }>("/api/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const s: Session = { user: data.customer, token: data.token };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
      setSession(s);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: (e as Error).message };
    }
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        const data = await api<{ customer: ApiUser; token: string }>(
          "/api/customers",
          {
            method: "POST",
            body: JSON.stringify({ name, email, password }),
          },
        );
        const s: Session = { user: data.customer, token: data.token };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
        setSession(s);
        return { ok: true };
      } catch (e) {
        return { ok: false, error: (e as Error).message };
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    const token = session?.token;
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
    if (token) {
      try {
        await api("/api/logout", { method: "POST", token });
      } catch {
        // ignore network errors on logout
      }
    }
  }, [session]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      ready,
      login,
      register,
      logout,
    }),
    [session, ready, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}