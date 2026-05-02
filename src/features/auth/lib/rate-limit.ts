/**
 * ╔══════════════════════════════════════════╗
 * ║      AUTH FEATURE — RATE LIMITER         ║
 * ╚══════════════════════════════════════════╝
 *
 * Implementación en memoria por defecto.
 *
 * ⚠️  LIMITACIÓN SERVERLESS:
 * En entornos serverless (Vercel, AWS Lambda) cada instancia
 * tiene su propio mapa en memoria. Para producción con múltiples
 * instancias, swappeá por la implementación Redis más abajo.
 *
 * SWAP A REDIS:
 *   1. `pnpm add ioredis`
 *   2. Reemplazá el Map por la implementación Redis al final del archivo
 *   3. Configurá REDIS_URL en tu .env
 */

import { AUTH_CONFIG } from "../config";

const { MAX_ATTEMPTS, WINDOW_MS } = AUTH_CONFIG.RATE_LIMIT;

// ─── Interfaz del store (swappable) ──────────────────────────────────────────

interface RateLimitStore {
  increment(key: string): Promise<{ count: number; resetTime: number }>;
  getEntry(key: string): Promise<{ count: number; resetTime: number } | null>;
  reset(key: string): Promise<void>;
  cleanup(): Promise<void>;
}

// ─── Implementación en memoria ───────────────────────────────────────────────

interface MemoryEntry {
  count: number;
  resetTime: number;
}

class MemoryRateLimitStore implements RateLimitStore {
  private map = new Map<string, MemoryEntry>();

  async increment(key: string) {
    const now = Date.now();
    const entry = this.map.get(key);

    if (!entry || now > entry.resetTime) {
      const newEntry = { count: 1, resetTime: now + WINDOW_MS };
      this.map.set(key, newEntry);
      return newEntry;
    }

    entry.count++;
    return entry;
  }

  async getEntry(key: string) {
    const entry = this.map.get(key);
    if (!entry) return null;
    if (Date.now() > entry.resetTime) {
      this.map.delete(key);
      return null;
    }
    return entry;
  }

  async reset(key: string) {
    this.map.delete(key);
  }

  async cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.map.entries()) {
      if (now > entry.resetTime) this.map.delete(key);
    }
  }
}

// ─── Singleton del store ──────────────────────────────────────────────────────

const store: RateLimitStore = new MemoryRateLimitStore();

// Cleanup automático cada 30 minutos
if (typeof setInterval !== "undefined") {
  setInterval(() => store.cleanup(), 30 * 60 * 1000);
}

// ─── API pública ─────────────────────────────────────────────────────────────

export interface RateLimitResult {
  limited: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/**
 * Verifica y registra un intento. Retorna el estado del rate limit.
 * Llamar UNA SOLA VEZ por request (incrementa el contador).
 */
export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  const entry = await store.increment(identifier);
  const limited = entry.count > MAX_ATTEMPTS;
  const remaining = Math.max(0, MAX_ATTEMPTS - entry.count);
  const retryAfterSeconds = limited
    ? Math.ceil((entry.resetTime - Date.now()) / 1000)
    : 0;

  return { limited, remaining, retryAfterSeconds };
}

/**
 * Solo consulta sin incrementar (útil para headers informativos).
 */
export async function getRateLimitStatus(identifier: string): Promise<RateLimitResult> {
  const entry = await store.getEntry(identifier);
  if (!entry) return { limited: false, remaining: MAX_ATTEMPTS, retryAfterSeconds: 0 };

  const limited = entry.count > MAX_ATTEMPTS;
  const remaining = Math.max(0, MAX_ATTEMPTS - entry.count);
  const retryAfterSeconds = limited
    ? Math.ceil((entry.resetTime - Date.now()) / 1000)
    : 0;

  return { limited, remaining, retryAfterSeconds };
}

/**
 * Resetea el rate limit para un identifier (útil tras login exitoso).
 */
export async function resetRateLimit(identifier: string): Promise<void> {
  await store.reset(identifier);
}

// ─── Implementación Redis (descomentar para swap) ─────────────────────────────
/*
import Redis from "ioredis";

class RedisRateLimitStore implements RateLimitStore {
  private redis = new Redis(process.env.REDIS_URL!);

  async increment(key: string) {
    const redisKey = `rate_limit:${key}`;
    const now = Date.now();
    const resetTime = now + WINDOW_MS;

    const count = await this.redis.incr(redisKey);
    if (count === 1) {
      await this.redis.pexpire(redisKey, WINDOW_MS);
    }
    const ttl = await this.redis.pttl(redisKey);
    return { count, resetTime: now + ttl };
  }

  async getEntry(key: string) {
    const redisKey = `rate_limit:${key}`;
    const [count, ttl] = await Promise.all([
      this.redis.get(redisKey),
      this.redis.pttl(redisKey),
    ]);
    if (!count) return null;
    return { count: parseInt(count), resetTime: Date.now() + ttl };
  }

  async reset(key: string) {
    await this.redis.del(`rate_limit:${key}`);
  }

  async cleanup() {} // Redis expira solo con TTL
}
*/
