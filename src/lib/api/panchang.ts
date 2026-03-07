// Panchang API — standalone panchang calculations (no client required)
// Primary: Gateway route /api/v1/panchang → astro-engine /api/panchanga
// Fallback: Direct Astro Engine call if gateway route is unavailable

import { apiFetch } from './core';

const GATEWAY_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL?.replace('/api/v1', '') || 'http://localhost:8080';
const ASTRO_ENGINE_URL = process.env.NEXT_PUBLIC_ASTRO_ENGINE_URL || 'https://api-astro.grahvani.in';

export interface PanchangRequest {
    birthDate: string;    // YYYY-MM-DD (the date to calculate panchang for)
    birthTime: string;    // HH:MM:SS (time at that date, e.g. sunrise time)
    latitude: number;
    longitude: number;
    timezoneOffset: number; // Hours from UTC (e.g. 5.5 for IST)
}

export interface PanchangResponse {
    success: boolean;
    data: Record<string, unknown>;
    cached: boolean;
}

// Default location: Delhi, India (fallback for dashboard widget)
const DEFAULT_LOCATION = {
    latitude: 28.6139,
    longitude: 77.209,
    timezoneOffset: 5.5,
};

function todayRequest(overrides?: Partial<PanchangRequest>): PanchangRequest {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');

    return {
        birthDate: `${yyyy}-${mm}-${dd}`,
        birthTime: `${hh}:${min}:00`,
        ...DEFAULT_LOCATION,
        ...overrides,
    };
}

/** Try gateway first, fall back to direct Astro Engine if gateway returns 404 */
async function fetchWithFallback(gatewayPath: string, enginePath: string, body: string): Promise<PanchangResponse> {
    try {
        return await apiFetch(`${GATEWAY_URL}${gatewayPath}`, { method: 'POST', body });
    } catch (error: unknown) {
        const is404 = error instanceof Error && ('status' in error) && (error as { status: number }).status === 404;
        const isNetworkError = error instanceof Error && error.message === 'Failed to fetch';
        if (is404 || isNetworkError) {
            // Gateway doesn't have this route yet — call Astro Engine directly
            return await apiFetch(`${ASTRO_ENGINE_URL}${enginePath}`, { method: 'POST', body });
        }
        throw error;
    }
}

export const panchangApi = {
    getPanchang: (req?: Partial<PanchangRequest>): Promise<PanchangResponse> =>
        fetchWithFallback('/api/v1/panchang', '/api/panchanga', JSON.stringify(todayRequest(req))),

    getChoghadiya: (req?: Partial<PanchangRequest>): Promise<PanchangResponse> =>
        fetchWithFallback('/api/v1/panchang/choghadiya', '/api/panchanga/choghadiya', JSON.stringify(todayRequest(req))),

    getHora: (req?: Partial<PanchangRequest>): Promise<PanchangResponse> =>
        fetchWithFallback('/api/v1/panchang/hora', '/api/panchanga/hora', JSON.stringify(todayRequest(req))),

    getMuhurat: (req?: Partial<PanchangRequest>): Promise<PanchangResponse> =>
        fetchWithFallback('/api/v1/panchang/muhurat', '/api/panchanga/muhurat', JSON.stringify(todayRequest(req))),
};
