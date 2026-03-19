// Grantha Report Engine — API Client
// Uses the same JWT token from useAuthTokenStore (Grantha validates Grahvani JWTs directly)

import { apiFetch, getAccessToken } from './core';
import type { Client } from '@/types/client';
import type {
    Blueprint,
    BlueprintEstimate,
    ReportJob,
    ReportListItem,
    GenerateReportInput,
    GenerateReportResponse,
    GranthaBirthData,
} from '@/types/grantha';

const GRANTHA_URL = process.env.NEXT_PUBLIC_GRANTHA_URL || 'https://grantha.astrocorp.in';

// ── Birth Data Mapper ───────────────────────────────────────────────

/**
 * Maps Grahvani's Client type to Grantha's birthData format.
 * IMPORTANT: Expects raw ISO date strings (YYYY-MM-DD, HH:mm).
 * If the client has been through deriveNames()/formatDate(), the dates
 * are still in YYYY-MM-DD format (formatDate normalizes TO ISO, not FROM it).
 */
export function clientToGranthaBirthData(client: Client): GranthaBirthData {
    if (!client.birthDate || !client.birthTime) {
        throw new Error('Client is missing required birth data (date or time)');
    }
    if (client.birthLatitude == null || client.birthLongitude == null) {
        throw new Error('Client is missing birth coordinates. Please set a birth location before generating.');
    }

    return {
        name: client.fullName,
        dob: client.birthDate.slice(0, 10),
        tob: client.birthTime.slice(0, 5),
        lat: Number(client.birthLatitude),
        lng: Number(client.birthLongitude),
        gender: client.gender || 'other',
    };
}

// ── Grantha-specific fetch wrapper ──────────────────────────────────

/**
 * Wraps apiFetch to point at the Grantha API base URL.
 * NOTE: apiFetch returns response.json() directly (no unwrapping).
 * Grantha responses are either flat objects or { data: T[] } for lists.
 */
async function granthaFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    return apiFetch<T>(`${GRANTHA_URL}/api/v1${path}`, options);
}

// ── API Client ──────────────────────────────────────────────────────

export const granthaApi = {
    // ── Blueprints ────────────────────────────────────────────────
    // GET /blueprints returns { data: Blueprint[] }
    getBlueprints: (): Promise<{ data: Blueprint[] }> =>
        granthaFetch('/blueprints'),

    // GET /blueprints/:id returns flat Blueprint object
    getBlueprintById: (id: string): Promise<Blueprint> =>
        granthaFetch(`/blueprints/${id}`),

    // GET /blueprints/:id/estimate returns flat estimate object
    estimateReport: (blueprintId: string): Promise<BlueprintEstimate> =>
        granthaFetch(`/blueprints/${blueprintId}/estimate`),

    // ── Reports ───────────────────────────────────────────────────
    // POST /reports returns flat { id, status, progress, ... } with 202
    generateReport: (input: GenerateReportInput): Promise<GenerateReportResponse> =>
        granthaFetch('/reports', {
            method: 'POST',
            body: JSON.stringify(input),
        }),

    // GET /reports/:id returns flat report object
    getReport: (id: string): Promise<ReportJob> =>
        granthaFetch(`/reports/${id}`),

    // GET /reports returns { data: ReportListItem[], pagination: {...} }
    getReports: (params?: { page?: number; pageSize?: number; status?: string }): Promise<{
        data: ReportListItem[];
        pagination: { page: number; pageSize: number; total: number; totalPages: number };
    }> => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set('page', String(params.page));
        if (params?.pageSize) searchParams.set('pageSize', String(params.pageSize));
        if (params?.status) searchParams.set('status', params.status);
        const query = searchParams.toString();
        return granthaFetch(`/reports${query ? `?${query}` : ''}`);
    },

    // DELETE /reports/:id returns { id, status: 'CANCELLED', cancelledAt }
    cancelReport: (id: string): Promise<{ id: string; status: string; cancelledAt: string }> =>
        granthaFetch(`/reports/${id}`, { method: 'DELETE' }),

    // ── SSE Progress Stream ───────────────────────────────────────
    // Uses query param token because EventSource can't set Authorization header.
    // Grantha auth middleware supports ?token= for SSE endpoints.
    streamProgress: (reportId: string): EventSource => {
        const token = getAccessToken();
        const url = `${GRANTHA_URL}/api/v1/reports/${reportId}/progress${token ? `?token=${encodeURIComponent(token)}` : ''}`;
        return new EventSource(url);
    },
};
