const rawBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
export const API_BASE = /^https?:\/\//.test(rawBase) ? rawBase : `https://${rawBase}`;

export type ApiUser = { id: number; name: string; email: string };

export async function api<T = unknown>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, headers, ...rest } = options;
  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return data as T;
}