// Panchang API — standalone panchang calculations (no client required)
// Gateway route: /api/v1/panchang → astro-engine /api/panchanga

import { apiFetch, CLIENT_URL } from './core';

const GATEWAY_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL?.replace('/api/v1', '') || 'http://localhost:8080';

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

export const panchangApi = {
    getPanchang: (req?: Partial<PanchangRequest>): Promise<PanchangResponse> =>
        apiFetch(`${GATEWAY_URL}/api/v1/panchang`, {
            method: 'POST',
            body: JSON.stringify(todayRequest(req)),
        }),

    getChoghadiya: (req?: Partial<PanchangRequest>): Promise<PanchangResponse> =>
        apiFetch(`${GATEWAY_URL}/api/v1/panchang/choghadiya`, {
            method: 'POST',
            body: JSON.stringify(todayRequest(req)),
        }),

    getHora: (req?: Partial<PanchangRequest>): Promise<PanchangResponse> =>
        apiFetch(`${GATEWAY_URL}/api/v1/panchang/hora`, {
            method: 'POST',
            body: JSON.stringify(todayRequest(req)),
        }),

    getMuhurat: (req?: Partial<PanchangRequest>): Promise<PanchangResponse> =>
        apiFetch(`${GATEWAY_URL}/api/v1/panchang/muhurat`, {
            method: 'POST',
            body: JSON.stringify(todayRequest(req)),
        }),
};
