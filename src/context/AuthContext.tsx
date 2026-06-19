"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  clearAuthSession,
  getAccessToken,
  getStoredUser,
  storeAuthSession,
} from "@/lib/auth";
import { STORAGE_KEYS } from "@/lib/constants";
import { parseApiError } from "@/lib/errors";
import { normalizeRoles } from "@/lib/utils";
import { apiConfig } from "@/config/api";
import { routes } from "@/config/routes";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  ValidateTokenResponse,
} from "@/types";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function normalizeUser(user: User): User {
  return {
    ...user,
    roles: normalizeRoles(user.roles),
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(() => {
    const stored = getStoredUser();
    setUser(stored ? normalizeUser(stored) : null);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function bootstrapSession() {
      const token = getAccessToken();
      if (!token) {
        if (!cancelled) setIsLoading(false);
        return;
      }

      try {
        const { data } = await api.post<ValidateTokenResponse>(
          apiConfig.endpoints.auth.validate,
          { token }
        );
        if (!cancelled) {
          if (data.valid) {
            refreshUser();
          } else {
            clearAuthSession();
            setUser(null);
          }
        }
      } catch {
        if (!cancelled) {
          clearAuthSession();
          setUser(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    bootstrapSession();
    return () => {
      cancelled = true;
    };
  }, [refreshUser]);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      setIsLoading(true);
      try {
        const response = await api.post<AuthResponse>(
          apiConfig.endpoints.auth.login,
          credentials
        );
        const authData = response.data;
        storeAuthSession({
          ...authData,
          user: normalizeUser(authData.user),
        });
        setUser(normalizeUser(authData.user));
        router.push(routes.dashboard.root);
      } catch (error) {
        throw parseApiError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      setIsLoading(true);
      try {
        const response = await api.post<AuthResponse>(
          apiConfig.endpoints.auth.register,
          data
        );
        const authData = response.data;
        storeAuthSession({
          ...authData,
          user: normalizeUser(authData.user),
        });
        setUser(normalizeUser(authData.user));
        router.push(routes.dashboard.root);
      } catch (error) {
        throw parseApiError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      const refreshToken =
        typeof window !== "undefined"
          ? localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
          : null;
      if (refreshToken) {
        await api.post(apiConfig.endpoints.auth.logout, { refreshToken });
      }
    } catch {
      // Déconnexion locale même si l'API échoue
    } finally {
      clearAuthSession();
      setUser(null);
      setIsLoading(false);
      router.push(routes.auth.login);
    }
  }, [router]);

  const updateUser = useCallback((nextUser: User) => {
    const normalized = normalizeUser(nextUser);
    setUser(normalized);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(normalized));
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      logout,
      updateUser,
      refreshUser,
    }),
    [user, isLoading, login, register, logout, updateUser, refreshUser]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
}
