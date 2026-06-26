import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { apiConfig } from "@/config/api";
import { STORAGE_KEYS } from "./constants";
import { routes } from "@/config/routes";
import type { TokenResponse } from "@/types/auth";
import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
  storeAuthSession,
} from "./auth";
import { isBrowser } from "./utils";

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const api = axios.create({
  baseURL: apiConfig.baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: apiConfig.timeout,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const response = await axios.post<TokenResponse>(
    `${apiConfig.baseUrl}/auth/refresh`,
    { refreshToken }
  );

  const accessToken = response.data.accessToken || response.data.token;
  if (!accessToken) return null;

  const storedUser = getStoredUser();
  if (storedUser) {
    storeAuthSession({
      accessToken,
      token: accessToken,
      refreshToken: response.data.refreshToken,
      expiresIn: response.data.expiresIn,
      user: storedUser,
    });
  } else if (isBrowser()) {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
  }

  return accessToken;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null;
          });
        }

        const newToken = await refreshPromise;
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch {
        clearAuthSession();
        if (isBrowser()) {
          window.location.href = routes.auth.login;
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
