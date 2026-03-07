// Core API infrastructure — fetch wrapper, token management, auth refresh
// All domain API modules import apiFetch from this file.

import { useAuthTokenStore } from '@/store/useAuthTokenStore';

// ============ ENVIRONMENT VALIDATION (API-009/BI-001) ============
// Validate required env vars at module load time — fails fast in dev
const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:8080/api/v1';
const USER_URL = process.env.NEXT_PUBLIC_USER_SERVICE_URL || 'http://localhost:8080/api/v1';
const CLIENT_URL = process.env.NEXT_PUBLIC_CLIENT_SERVICE_URL || 'http://localhost:8080/api/v1';

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    const missing = ['NEXT_PUBLIC_AUTH_SERVICE_URL', 'NEXT_PUBLIC_USER_SERVICE_URL', 'NEXT_PUBLIC_CLIENT_SERVICE_URL']
        .filter(key => !process.env[key]);
    if (missing.length > 0) {
        console.warn(`[Grahvani API] Missing env vars (using localhost fallback): ${missing.join(', ')}`);
    }
}

export { AUTH_URL, USER_URL, CLIENT_URL };

// ============ TOKEN MANAGEMENT ============
// NOTE (ST-004): useAuthTokenStore.getState() is intentionally used outside React components.
// This bypasses Zustand's subscription/re-render system, which is correct here because
// apiFetch runs in non-React contexts (plain async functions). Do NOT convert to useStore() hooks.

export function getAccessToken(): string | null {
    const storeToken = useAuthTokenStore.getState().accessToken;
    if (storeToken) return storeToken;
    if (typeof window !== 'undefined') {
        const lsToken = localStorage.getItem('accessToken');
        if (lsToken) {
            useAuthTokenStore.getState().setAccessToken(lsToken);
            return lsToken;
        }
    }
    return null;
}

export function decodeJwtExp(token: string): number | null {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp || null;
    } catch {
        return null;
    }
}

export function isTokenExpiringSoon(token: string, thresholdSeconds: number = 60): boolean {
    const exp = decodeJwtExp(token);
    if (!exp) return false;
    return (exp * 1000 - Date.now()) < thresholdSeconds * 1000;
}

// ============ AUTH REFRESH ============
// Custom error for auth refresh failures — allows callers to distinguish
// refresh failures from other errors and show appropriate UI
export class AuthRefreshError extends Error {
    public readonly cause: unknown;
    constructor(message: string, cause?: unknown) {
        super(message);
        this.name = 'AuthRefreshError';
        this.cause = cause;
    }
}

/**
 * Structured API error carrying HTTP status, backend error code, and user-friendly message.
 * Thrown by apiFetch for non-OK responses — allows callers to distinguish
 * 403 (Forbidden) from 404 (Not Found) from 422 (Validation) etc.
 */
export class ApiError extends Error {
    public readonly status: number;
    public readonly code: string | undefined;
    public readonly details: unknown;

    constructor(message: string, status: number, code?: string, details?: unknown) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.code = code;
        this.details = details;
    }

    get isForbidden() { return this.status === 403; }
    get isNotFound() { return this.status === 404; }
    get isValidation() { return this.status === 400 || this.status === 422; }
    get isRateLimited() { return this.status === 429; }
    get isServerError() { return this.status >= 500; }
}

let refreshPromise: Promise<string | null> | null = null;

export async function refreshAccessToken(): Promise<string | null> {
    // Deduplicate concurrent refresh calls — all callers share the same promise
    if (refreshPromise) return refreshPromise;

    const currentPromise = (async () => {
        try {
            const store = useAuthTokenStore.getState();
            const refreshToken = store.refreshToken ||
                (typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null);

            if (!refreshToken) return null;

            store.setIsRefreshing(true);

            const response = await fetch(`${AUTH_URL}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
            });

            if (!response.ok) {
                const errorBody = await response.text().catch(() => '');
                throw new AuthRefreshError(
                    `Token refresh failed with status ${response.status}: ${errorBody}`
                );
            }

            const data = await response.json();
            const newAccessToken = data.tokens?.accessToken || data.accessToken;
            const newRefreshToken = data.tokens?.refreshToken || data.refreshToken;

            if (newAccessToken) {
                store.setTokens(newAccessToken, newRefreshToken || refreshToken);
                return newAccessToken;
            }

            throw new AuthRefreshError('Token refresh response missing accessToken');
        } catch (error: unknown) {
            if (error instanceof AuthRefreshError) throw error;
            throw new AuthRefreshError(
                'Token refresh failed due to network or parsing error',
                error
            );
        } finally {
            useAuthTokenStore.getState().setIsRefreshing(false);
        }
    })();

    refreshPromise = currentPromise;

    // RACE CONDITION FIX (API-001): Clear the cached promise reference AFTER
    // all microtask subscribers have consumed the resolved/rejected value.
    currentPromise.finally(() => {
        queueMicrotask(() => {
            if (refreshPromise === currentPromise) {
                refreshPromise = null;
            }
        });
    });

    return currentPromise;
}

// ============ CORE FETCH WRAPPER ============
export async function apiFetch<T = unknown>(url: string, options: RequestInit = {}): Promise<T> {
    let token = getAccessToken();

    if (token && isTokenExpiringSoon(token)) {
        try {
            const newToken = await refreshAccessToken();
            if (newToken) token = newToken;
        } catch {
            // Pre-emptive refresh failed — continue with existing token.
            // The 401 retry path below will handle actual expiration.
        }
    }

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...((options.headers as Record<string, string>) || {}),
    };

    const maxRetries = 3;
    let attempt = 0;
    const method = (options.method || 'GET').toUpperCase();
    // API-004 FIX: Only idempotent methods are safe to retry — POST/PATCH can create duplicates
    const isIdempotent = ['GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS'].includes(method);

    while (attempt < maxRetries) {
        try {
            const response = await fetch(url, { ...options, headers });

            if (!response.ok) {
                // API-004 FIX: Only retry 429 for idempotent methods to prevent duplicate creation
                const isRetryable429 = response.status === 429 && isIdempotent;
                const isRetryable5xx = response.status >= 500 && isIdempotent;
                if ((isRetryable429 || isRetryable5xx) && attempt < maxRetries - 1) {
                    const retryAfter = response.headers.get('Retry-After');
                    const delay = retryAfter ? parseInt(retryAfter, 10) * 1000 : Math.pow(2, attempt) * 1000;
                    await new Promise(r => setTimeout(r, delay));
                    attempt++;
                    continue;
                }

                // API-010 FIX: Attempt response.text() as fallback when JSON parsing fails
                const errorData = await response.json().catch(async () => {
                    const textBody = await response.text().catch(() => '');
                    return textBody ? { message: textBody } : {};
                });

                if (response.status === 401 && typeof window !== 'undefined') {
                    try {
                        const newToken = await refreshAccessToken();
                        if (newToken) {
                            const retryHeaders = {
                                ...headers,
                                'Authorization': `Bearer ${newToken}`,
                            };
                            const retryResponse = await fetch(url, { ...options, headers: retryHeaders });
                            if (retryResponse.ok) {
                                if (retryResponse.status === 204) return {} as T;
                                return retryResponse.json();
                            }
                        }
                    } catch {
                        // Refresh itself failed — fall through to clear tokens
                    }

                    // API-003 FIX: Explicitly throw after clearing tokens instead of falling through
                    useAuthTokenStore.getState().clearTokens();
                    if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                        window.history.replaceState({}, '', `/login?expired=true&redirect=${encodeURIComponent(window.location.pathname)}`);
                        window.location.reload();
                    }
                    throw new Error('Session expired. Please log in again.');
                }

                const errorMessage = errorData.error?.message || errorData.message || `API Error: ${response.status} ${response.statusText}`;
                const errorCode = errorData.error?.code || errorData.code;
                const errorDetails = errorData.error?.details || errorData.details;
                throw new ApiError(errorMessage, response.status, errorCode, errorDetails);
            }

            if (response.status === 204) {
                return {} as T;
            }

            return response.json();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            const isNetworkError = errorMessage === 'Failed to fetch' || errorMessage.includes('Network request failed');
            if (isNetworkError && attempt < maxRetries - 1) {
                const delay = Math.pow(2, attempt) * 1000;
                await new Promise(r => setTimeout(r, delay));
                attempt++;
                continue;
            }
            throw error;
        }
    }
    throw new Error('Max retries exceeded');
}
