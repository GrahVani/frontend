// Knowledge API — public read-only educational content
// Routes through API gateway: /api/v1/knowledge/*
// No auth required — all endpoints are public with HTTP caching.

import type {
    KnowledgeTermResponse,
    KnowledgeBatchResponse,
    KnowledgeSearchResponse,
    KnowledgeStatsResponse,
} from '@/types/knowledge.types';

// Uses the same gateway base URL as other services.
// In production: https://api-gateway.grahvani.in/api/v1
// In development: http://localhost:8080/api/v1
const GATEWAY_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:8080/api/v1';

/** Lightweight fetch for public knowledge endpoints — no auth tokens needed */
async function knowledgeFetch<T>(path: string): Promise<T> {
    const response = await fetch(`${GATEWAY_URL}/knowledge${path}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
            errorData?.error?.message || `Knowledge API error: ${response.status}`
        );
    }

    return response.json();
}

export const knowledgeApi = {
    /** Fetch a single knowledge entry by termKey */
    getByTermKey: (termKey: string): Promise<KnowledgeTermResponse> =>
        knowledgeFetch(`/${encodeURIComponent(termKey)}`),

    /** Fetch multiple entries in a single request (max 50) */
    getBatch: (keys: string[]): Promise<KnowledgeBatchResponse> =>
        knowledgeFetch(`/batch?keys=${keys.map(encodeURIComponent).join(',')}`),

    /** Full-text search across terms */
    search: (q: string, domain?: string, limit?: number): Promise<KnowledgeSearchResponse> => {
        const params = new URLSearchParams({ q });
        if (domain) params.set('domain', domain);
        if (limit) params.set('limit', String(limit));
        return knowledgeFetch(`/search?${params}`);
    },

    /** Get aggregate stats (total count, by domain, by category) */
    getStats: (): Promise<KnowledgeStatsResponse> =>
        knowledgeFetch('/stats'),
};
