// Auth & User API endpoints

import { apiFetch, AUTH_URL, USER_URL } from './core';
import type { LoginCredentials, RegisterPayload, AuthTokensResponse, UserPreferences } from './types';

export const authApi = {
    login: (credentials: LoginCredentials) => apiFetch<AuthTokensResponse>(`${AUTH_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify(credentials),
    }),
    register: (data: RegisterPayload) => apiFetch<AuthTokensResponse>(`${AUTH_URL}/auth/register`, {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    logout: () => apiFetch<{ success: boolean }>(`${AUTH_URL}/auth/logout`, {
        method: 'POST',
    }),
    refresh: (refreshToken: string) => apiFetch<AuthTokensResponse>(`${AUTH_URL}/auth/refresh`, {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
    }),
};

export const userApi = {
    getMe: () => apiFetch<Record<string, unknown>>(`${USER_URL}/users/me`),
    updatePreferences: (prefs: UserPreferences) => apiFetch<Record<string, unknown>>(`${USER_URL}/users/me/preferences`, {
        method: 'PUT',
        body: JSON.stringify(prefs),
    }),
};
