// Lightweight helpers to use Cloudflare KV from Astro locals

export type KV = {
  get: (key: string, opts?: { type?: 'text' | 'json' | 'arrayBuffer'; cacheTtl?: number }) => Promise<any>;
  put: (key: string, value: string | ArrayBuffer | ReadableStream | null, opts?: { expiration?: number; expirationTtl?: number; metadata?: any }) => Promise<void>;
  delete: (key: string) => Promise<void>;
};

export function getKV(locals: any): KV | undefined {
  const env = locals?.runtime?.env as any;
  const kv = env?.STACKNEWS_KV as KV | undefined;
  return kv;
}

export async function kvGetJSON<T>(kv: KV | undefined, key: string): Promise<T | null> {
  if (!kv) return null;
  try {
    const raw = await kv.get(key, { type: 'text' });
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function kvPutJSON(kv: KV | undefined, key: string, value: any, ttlSeconds?: number): Promise<void> {
  if (!kv) return;
  try {
    const opts: any = {};
    if (ttlSeconds && ttlSeconds > 0) opts.expirationTtl = ttlSeconds;
    await kv.put(key, JSON.stringify(value), opts);
  } catch {}
}

