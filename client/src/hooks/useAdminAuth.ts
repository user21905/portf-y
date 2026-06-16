import { useState, useEffect, useCallback } from "react";
import { authApi } from "@/api/auth";
import { ROUTES } from "@/config/constants";

interface AdminUser {
  id: string;
  username: string;
}

export function useAdminAuth() {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const { admin: user } = await authApi.me();
      setAdmin(user);
      return true;
    } catch {
      setAdmin(null);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(
    async (username: string, password: string) => {
      await authApi.login({ username, password });
      await checkAuth();
    },
    [checkAuth]
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setAdmin(null);
      window.location.href = ROUTES.ADMIN_LOGIN;
    }
  }, []);

  return { admin, loading, isAuthenticated: !!admin, login, logout, checkAuth };
}
