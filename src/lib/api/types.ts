// API Type Definitions for Grahvani Frontend

import type { KpPromise } from '@/types/kp.types';

// ============ STANDARD RESPONSE ENVELOPES (BF-007) ============

/** Standard API response envelope — all backend endpoints should return this shape. */
export interface ApiResponse<T = unknown> {
    success: boolean;
    data: T;
    error?: {
        code?: string;
        message: string;
        details?: unknown;
    };
    meta?: Record<string, unknown>;
    cached?: boolean;
    calculatedAt?: string;
}

/** Pagination metadata returned by list endpoints. */
export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

/** Paginated response envelope — extends ApiResponse with pagination metadata. */
export interface PaginatedResponse<T = unknown> {
    success: boolean;
    data: T[];
    pagination: PaginationMeta;
    meta?: Record<string, unknown>;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterPayload {
    email: string;
    password: string;
    name?: string;
    phone?: string;
}

export interface AuthTokensResponse {
    accessToken?: string;
    refreshToken?: string;
    tokens?: {
        accessToken: string;
        refreshToken: string;
    };
    user?: Record<string, unknown>;
}

/** Normalized auth tokens — resolves the dual-format ambiguity (BF-006). */
export interface NormalizedTokens {
    accessToken: string;
    refreshToken: string;
    user?: Record<string, unknown>;
}

/**
 * Extracts tokens from either backend response shape:
 *   - { accessToken, refreshToken }         (flat)
 *   - { tokens: { accessToken, refreshToken } }  (nested)
 * Returns null if no valid accessToken is found.
 */
export function normalizeAuthTokens(response: AuthTokensResponse): NormalizedTokens | null {
    const accessToken = response.accessToken || response.tokens?.accessToken;
    const refreshToken = response.refreshToken || response.tokens?.refreshToken;

    if (!accessToken) return null;

    return {
        accessToken,
        refreshToken: refreshToken || '',
        user: response.user,
    };
}

export interface UserPreferences {
    ayanamsa?: string;
    chartStyle?: string;
    language?: string;
    theme?: string;
    [key: string]: unknown;
}

export interface ChartRecord {
    id: string;
    chartType: string;
    ayanamsa?: string;
    system?: string;
    chartConfig?: {
        ayanamsa?: string;
        system?: string;
        [key: string]: unknown;
    };
    data?: Record<string, unknown>;
    [key: string]: unknown;
}

export interface ChartGenerateResponse {
    success: boolean;
    data: Record<string, unknown>;
    cached?: boolean;
    calculatedAt?: string;
    [key: string]: unknown;
}

export interface SudarshanChakraResponse {
    success: boolean;
    data: Record<string, unknown>;
    cached?: boolean;
    calculatedAt?: string;
}

export interface KpInterlinkResponse {
    promises: KpPromise[];
    [key: string]: unknown;
}

export interface DashaPeriod {
    planet: string;
    startDate: string;
    endDate: string;
    isCurrent?: boolean;
    ageAtStart?: number;
    subPeriods?: DashaPeriod[];
}

export interface DashaResponse {
    clientId: string;
    clientName: string;
    level: string;
    ayanamsa: string;
    data: {
        mahadashas?: DashaPeriod[];
        current_dasha?: DashaPeriod;
    };
    dasha_list?: DashaPeriod[];
    cached: boolean;
    calculatedAt: string;
}

export interface AshtakavargaResponse {
    clientId: string;
    clientName: string;
    ayanamsa: string;
    data: {
        sarvashtakavarga?: Record<string, number[]>;
        bhinnashtakavarga?: Record<string, Record<string, number[]>>;
        total_points?: number;
    };
    cached: boolean;
    calculatedAt: string;
}

export interface SystemCapabilities {
    charts: {
        divisional: string[];
        special: string[];
        lagna: string[];
        rare_shodash?: string[];
    };
    features: {
        dasha: string[];
        ashtakavarga: string[];
        shadbala: string[];
        compatibility: string[];
        numerology: string[];
    };
    hasDivisional: boolean;
    hasAshtakavarga: boolean;
    hasNumerology: boolean;
    hasCompatibility: boolean;
    hasHorary: boolean;
}
