// Chaldean Numerology API — direct astro-engine calls (no auth required)
// Follows panchang.ts pattern: direct fetch, no gateway proxy

import type { ChaldeanServiceResponse, ChaldeanRawResponse, RawCalculatorSlug } from '@/types/numerology.types';

const ASTRO_ENGINE_URL = process.env.NEXT_PUBLIC_ASTRO_ENGINE_URL || 'https://api-astro.grahvani.in';
const BASE = `${ASTRO_ENGINE_URL}/api/numerology/chaldean`;
const RAW_BASE = `${ASTRO_ENGINE_URL}/api/numerology/chaldean/raw`;

async function numerologyFetch<T>(path: string, body: Record<string, unknown>): Promise<T> {
    const response = await fetch(`${ASTRO_ENGINE_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
            errorData?.error || `Numerology API error: ${response.status} ${response.statusText}`
        );
    }

    return response.json();
}

async function numerologyGet<T>(path: string): Promise<T> {
    const response = await fetch(`${ASTRO_ENGINE_URL}${path}`);
    if (!response.ok) {
        throw new Error(`Numerology API error: ${response.status} ${response.statusText}`);
    }
    return response.json();
}

// =============================================================================
// PUBLIC API
// =============================================================================

export const numerologyApi = {
    /** Health check for the Chaldean service */
    healthCheck: () =>
        numerologyGet<{ success: boolean; status: string }>('/api/numerology/chaldean/health'),

    /**
     * Generic service endpoint call — covers all 76 service endpoints.
     * @param category - e.g. "naming", "numbers", "relationships"
     * @param slug - e.g. "baby-name-analyze", "love-compatibility"
     * @param data - input payload matching the endpoint's expected schema
     */
    service: (category: string, slug: string, data: Record<string, unknown>): Promise<ChaldeanServiceResponse> =>
        numerologyFetch<ChaldeanServiceResponse>(
            `/api/numerology/chaldean/${category}/${slug}`,
            data,
        ),

    /**
     * Generic raw calculator call — covers all 92 raw calculators.
     * @param slug - one of the 92 RawCalculatorSlug values
     * @param data - input payload (typically full_name + birth_date)
     */
    rawCalculate: (slug: RawCalculatorSlug | string, data: Record<string, unknown>): Promise<ChaldeanRawResponse> =>
        numerologyFetch<ChaldeanRawResponse>(
            `/api/numerology/chaldean/raw/${slug}`,
            data,
        ),

    /** Fetch the raw calculator catalog (list of all available calculators) */
    rawCatalog: () =>
        numerologyGet<{ success: boolean; calculators: string[] }>('/api/numerology/chaldean/raw/catalog'),
};
