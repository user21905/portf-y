import { toast } from "@/lib/toast-bus";

const API_BASE = "/api";

export type ApiRequestOptions = RequestInit & { silent?: boolean };

function shouldNotifyToast(path: string, status: number, silent?: boolean): boolean {
  if (silent) return false;
  if (path === "/auth/me" && status === 401) return false;
  if (path === "/content") return false;
  if (/^\/projects\//.test(path)) return false;
  return true;
}

function extractErrorMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === "object") {
    const p = payload as { error?: string; errors?: { msg?: string }[] };
    if (typeof p.error === "string" && p.error.trim()) return p.error;
    const first = p.errors?.[0]?.msg;
    if (typeof first === "string" && first.trim()) return first;
  }
  return fallback;
}

async function request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { silent, ...init } = options;
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => null);
    const message = extractErrorMessage(payload, res.statusText || "İstek başarısız");
    if (shouldNotifyToast(path, res.status, silent)) {
      toast(message, "error");
    }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string, opts?: Omit<ApiRequestOptions, "method" | "body">) =>
    request<T>(path, { ...opts, method: "GET" }),

  post: <T>(path: string, body?: unknown, opts?: Omit<ApiRequestOptions, "method" | "body">) =>
    request<T>(path, {
      ...opts,
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  put: <T>(path: string, body: unknown, opts?: Omit<ApiRequestOptions, "method" | "body">) =>
    request<T>(path, {
      ...opts,
      method: "PUT",
      body: JSON.stringify(body),
    }),

  patch: <T>(path: string, body?: unknown, opts?: Omit<ApiRequestOptions, "method" | "body">) =>
    request<T>(path, {
      ...opts,
      method: "PATCH",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  delete: (path: string, opts?: Omit<ApiRequestOptions, "method" | "body">) =>
    request<undefined>(path, { ...opts, method: "DELETE" }),
};
