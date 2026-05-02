/**
 * ╔══════════════════════════════════════════╗
 * ║      AUTH FEATURE — useAuth HOOK         ║
 * ╚══════════════════════════════════════════╝
 *
 * Hook cliente para acceder al usuario autenticado y hacer logout.
 *
 * USO:
 *   const { user, loading, logout } = useAuth()
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

import { AUTH_CONFIG } from "../config";
import type { AuthUser } from "../types/auth";

interface UseAuthReturn {
  user: Pick<AuthUser, "id" | "name" | "email" | "role"> | null;
  loading: boolean;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const [user, setUser] = useState<UseAuthReturn["user"]>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
      router.push(AUTH_CONFIG.ROUTES.AFTER_LOGOUT);
      router.refresh();
    }
  }, [router]);

  return { user, loading, logout };
}
