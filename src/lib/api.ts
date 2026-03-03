// API Utility for Grahvani Frontend
// Handles communication with microservices

import { CreateClientPayload, FamilyLinkPayload, Client, ClientListResponse, FamilyLink, LocationSuggestion } from '@/types/client';
import { extractPeriodsArray } from './dasha-utils';
import type {
    KpPlanetsCuspsResponse,
    KpRulingPlanetsResponse,
    KpBhavaDetailsResponse,
    KpSignificationsResponse,
    KpHoraryResponse,
} from '@/types/kp.types';

// ============ TYPE DEFINITIONS ============

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
    dasha_list?: any[]; // For deep tree structure
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

// Chart metadata for display
export const CHART_METADATA: Record<string, { name: string; desc: string; category: string }> = {
    'D1': { name: 'Rashi', desc: 'Physical Body & General Destiny', category: 'divisional' },
    'D2': { name: 'Hora', desc: 'Wealth & Financial Prospects', category: 'divisional' },
    'D3': { name: 'Drekkana', desc: 'Siblings & Courage', category: 'divisional' },
    'D4': { name: 'Chaturthamsha', desc: 'Fortune & Property', category: 'divisional' },
    'D7': { name: 'Saptamsha', desc: 'Children & Progeny', category: 'divisional' },
    'D9': { name: 'Navamsha', desc: 'Marriage & Spiritual Core', category: 'divisional' },
    'D10': { name: 'Dashamsha', desc: 'Career & Profession', category: 'divisional' },
    'D12': { name: 'Dwadashamsha', desc: 'Parents & Ancestry', category: 'divisional' },
    'D16': { name: 'Shodashamsha', desc: 'Vehicles & Comforts', category: 'divisional' },
    'D20': { name: 'Vimshamsha', desc: 'Spiritual Progress', category: 'divisional' },
    'D24': { name: 'Chaturvimshamsha', desc: 'Education & Learning', category: 'divisional' },
    'D27': { name: 'Saptavimshamsha', desc: 'Strength & Vitality', category: 'divisional' },
    'D30': { name: 'Trimshamsha', desc: 'Misfortunes & Evil', category: 'divisional' },
    'D40': { name: 'Khavedamsha', desc: 'Auspicious Effects', category: 'divisional' },
    'D45': { name: 'Akshavedamsha', desc: 'General Indications', category: 'divisional' },
    'D60': { name: 'Shashtiamsha', desc: 'Past Karma & Results', category: 'divisional' },
    'moon': { name: 'Moon Chart', desc: 'Emotional & Mental State', category: 'special' },
    'sun': { name: 'Sun Chart', desc: 'Soul Purpose & Father', category: 'special' },
    'sudarshan': { name: 'Sudarshan Chakra', desc: 'Triple View Analysis', category: 'special' },
    'transit': { name: 'Transit', desc: 'Current Planetary Positions', category: 'special' },
    'arudha': { name: 'Arudha Lagna', desc: 'Worldly Image & Perception', category: 'lagna' },
    'bhava': { name: 'Bhava Lagna', desc: 'House Strengths', category: 'lagna' },
    'hora': { name: 'Hora Lagna', desc: 'Wealth Indicator', category: 'lagna' },
    'sripathi': { name: 'Sripathi Bhava', desc: 'Unequal House System', category: 'lagna' },
    'kp_bhava': { name: 'KP Bhava', desc: 'KP System Houses', category: 'lagna' },
    'equal_bhava': { name: 'Equal Bhava', desc: 'Equal House System', category: 'lagna' },
    'karkamsha_d1': { name: 'Karkamsha D1', desc: 'Atmakaraka in Navamsha to D1', category: 'lagna' },
    'karkamsha_d9': { name: 'Karkamsha D9', desc: 'Atmakaraka in Navamsha', category: 'lagna' },
    'shadbala': { name: 'Shadbala', desc: 'Six-fold Planetary Strength Analysis', category: 'special' },
    'mandi': { name: 'Mandi', desc: 'Son of Saturn - Karmic Obstacles', category: 'lagna' },
    'gulika': { name: 'Gulika', desc: 'Son of Saturn - Instant Karma', category: 'lagna' },
};

// Dasha system metadata for display
export const DASHA_TYPES: Record<string, { name: string; years: number; desc: string; category: 'primary' | 'conditional' }> = {
    vimshottari: {
        name: 'Vimshottari',
        years: 120,
        desc: 'Universal Moon-nakshatra based dasha system',
        category: 'primary'
    },
    tribhagi: {
        name: 'Tribhagi',
        years: 40,
        desc: 'One-third portions of Vimshottari periods',
        category: 'conditional'
    },
    shodashottari: {
        name: 'Shodashottari',
        years: 116,
        desc: 'For Venus in 9th + Lagna in hora of Venus',
        category: 'conditional'
    },
    dwadashottari: {
        name: 'Dwadashottari',
        years: 112,
        desc: 'Venus in Lagna + Moon in Venusian nakshatra',
        category: 'conditional'
    },
    panchottari: {
        name: 'Panchottari',
        years: 105,
        desc: 'Cancer Lagna with Dhanishtha nakshatra',
        category: 'conditional'
    },
    chaturshitisama: {
        name: 'Chaturshitisama',
        years: 84,
        desc: '10th lord posited in 10th house',
        category: 'conditional'
    },
    satabdika: {
        name: 'Satabdika',
        years: 100,
        desc: 'Lagna in Vargottama position',
        category: 'conditional'
    },
    dwisaptati: {
        name: 'Dwisaptati Sama',
        years: 72,
        desc: 'Lagna lord in 7th or 7th lord in Lagna',
        category: 'conditional'
    },
    shastihayani: {
        name: 'Shastihayani',
        years: 60,
        desc: 'Sun posited in the Lagna',
        category: 'conditional'
    },
    shattrimshatsama: {
        name: 'Shattrimshatsama',
        years: 36,
        desc: 'Born in daytime with Moon in Lagna',
        category: 'conditional'
    },
    chara: {
        name: 'Chara (Jaimini)',
        years: 0,
        desc: 'Sign-based Jaimini dasha system',
        category: 'conditional'
    },
};

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:8080/api/v1';
const USER_URL = process.env.NEXT_PUBLIC_USER_SERVICE_URL || 'http://localhost:8080/api/v1';
const CLIENT_URL = process.env.NEXT_PUBLIC_CLIENT_SERVICE_URL || 'http://localhost:8080/api/v1';

// Token management helpers — use in-memory store with localStorage fallback for refresh token
import { useAuthTokenStore } from '@/store/useAuthTokenStore';

function getAccessToken(): string | null {
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

function decodeJwtExp(token: string): number | null {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp || null;
    } catch {
        return null;
    }
}

function isTokenExpiringSoon(token: string, thresholdSeconds: number = 60): boolean {
    const exp = decodeJwtExp(token);
    if (!exp) return false;
    return (exp * 1000 - Date.now()) < thresholdSeconds * 1000;
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
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

            if (!response.ok) return null;

            const data = await response.json();
            const newAccessToken = data.tokens?.accessToken || data.accessToken;
            const newRefreshToken = data.tokens?.refreshToken || data.refreshToken;

            if (newAccessToken) {
                store.setTokens(newAccessToken, newRefreshToken || refreshToken);
                return newAccessToken;
            }
            return null;
        } catch {
            return null;
        } finally {
            useAuthTokenStore.getState().setIsRefreshing(false);
            refreshPromise = null;
        }
    })();

    return refreshPromise;
}

async function apiFetch<T = any>(url: string, options: RequestInit = {}): Promise<T> {
    let token = getAccessToken();

    if (token && isTokenExpiringSoon(token)) {
        const newToken = await refreshAccessToken();
        if (newToken) token = newToken;
    }

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...((options.headers as any) || {}),
    };

    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            const response = await fetch(url, { ...options, headers });

            if (!response.ok) {
                if (response.status >= 500 || response.status === 429) {
                    if (attempt < maxRetries - 1) {
                        const delay = Math.pow(2, attempt) * 1000;
                        await new Promise(r => setTimeout(r, delay));
                        attempt++;
                        continue;
                    }
                }

                const errorData = await response.json().catch(() => ({}));

                if (response.status === 401 && typeof window !== 'undefined') {
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
                    useAuthTokenStore.getState().clearTokens();
                    if (!window.location.pathname.includes('/login')) {
                        window.location.href = '/login?expired=true';
                    }
                }

                const errorMessage = errorData.error?.message || errorData.message || `API Error: ${response.status}`;
                const errorDetails = errorData.error?.details ? ` - ${JSON.stringify(errorData.error.details)}` : '';
                throw new Error(`${errorMessage}${errorDetails}`);
            }

            if (response.status === 204) {
                return {} as T;
            }

            return response.json();
        } catch (error: any) {
            const isNetworkError = error.message === 'Failed to fetch' || error.message.includes('Network request failed');
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

// ============ AUTH API ============
export const authApi = {
    login: (credentials: any) => apiFetch(`${AUTH_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify(credentials),
    }),
    register: (data: any) => apiFetch(`${AUTH_URL}/auth/register`, {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    logout: () => apiFetch(`${AUTH_URL}/auth/logout`, {
        method: 'POST',
    }),
    refresh: (refreshToken: string) => apiFetch(`${AUTH_URL}/auth/refresh`, {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
    }),
};

// ============ USER API ============
export const userApi = {
    getMe: () => apiFetch(`${USER_URL}/users/me`),
    updatePreferences: (prefs: any) => apiFetch(`${USER_URL}/users/me/preferences`, {
        method: 'PUT',
        body: JSON.stringify(prefs),
    }),
};

// ============ CLIENT API ============
export const clientApi = {
    getClients: (params?: {
        page?: number;
        limit?: number;
        search?: string;
        gender?: string;
        city?: string;
        myClientsOnly?: boolean;
    }): Promise<ClientListResponse> => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set('page', String(params.page));
        if (params?.limit) searchParams.set('limit', String(params.limit));
        if (params?.search) searchParams.set('search', params.search);
        if (params?.gender) searchParams.set('gender', params.gender);
        if (params?.city) searchParams.set('city', params.city);
        if (params?.myClientsOnly) searchParams.set('myClientsOnly', 'true');

        const query = searchParams.toString();
        return apiFetch(`${CLIENT_URL}/clients${query ? `?${query}` : ''}`);
    },

    getClient: (id: string): Promise<Client> =>
        apiFetch(`${CLIENT_URL}/clients/${id}`),

    createClient: (data: CreateClientPayload): Promise<Client> =>
        apiFetch(`${CLIENT_URL}/clients`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    updateClient: (id: string, data: Partial<CreateClientPayload>): Promise<Client> =>
        apiFetch(`${CLIENT_URL}/clients/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),

    deleteClient: (id: string): Promise<void> =>
        apiFetch(`${CLIENT_URL}/clients/${id}`, {
            method: 'DELETE',
        }),

    getSuggestions: (query: string, limit: number = 5): Promise<{ suggestions: LocationSuggestion[] }> =>
        apiFetch(`${CLIENT_URL}/geocode/suggest?q=${encodeURIComponent(query)}&limit=${limit}`),

    getCharts: (clientId: string): Promise<any[]> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/charts`),

    generateChart: (clientId: string, chartType: string = 'D1', ayanamsa: string = 'lahiri', options: Record<string, any> = {}): Promise<any> => {
        const LAGNA_CHARTS = ['moon_chart', 'sun_chart', 'arudha_lagna', 'bhava_lagna', 'hora_lagna', 'sripathi_bhava', 'kp_bhava', 'equal_bhava', 'karkamsha_d1', 'karkamsha_d9', 'gl_chart', 'mandi', 'gulika'];
        let targetAyanamsa = ayanamsa;

        if (ayanamsa.toLowerCase() === 'kp' && (
            chartType.match(/^D\d+$/i) ||
            chartType.toLowerCase() === 'natal' ||
            LAGNA_CHARTS.includes(chartType.toLowerCase())
        )) {
            targetAyanamsa = 'lahiri';
        }

        return apiFetch(`${CLIENT_URL}/clients/${clientId}/charts/generate`, {
            method: 'POST',
            body: JSON.stringify({ chartType, ayanamsa: targetAyanamsa, ...options }),
        });
    },

    generateDailyTransit: (clientId: string, startDate: string, endDate: string): Promise<any> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/charts/generate`, {
            method: 'POST',
            body: JSON.stringify({
                chartType: 'daily_transit',
                ayanamsa: 'lahiri',
                transitStartDate: startDate,
                transitEndDate: endDate,
            }),
        }),

    generateCoreCharts: (clientId: string): Promise<{ success: boolean; count: number }> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/charts/generate-core`, {
            method: 'POST',
        }),

    generateFullVedicProfile: (clientId: string): Promise<{ success: boolean; count: number }> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/charts/generate-full`, {
            method: 'POST',
        }),

    generateDasha: (
        clientId: string,
        level: string = 'mahadasha',
        ayanamsa: string = 'lahiri',
        save: boolean = false,
        context: { mahaLord?: string; antarLord?: string; pratyantarLord?: string; drillDownPath?: string[] } = {}
    ): Promise<DashaResponse> => {
        console.log(`[API] generateDasha - Client: ${clientId}, Level: ${level}, Ayanamsa: ${ayanamsa}, Context:`, context);
        return apiFetch(`${CLIENT_URL}/clients/${clientId}/dasha`, {
            method: 'POST',
            body: JSON.stringify({ level, ayanamsa, save, ...context }),
        }).then(res => {
            console.log(`[API] generateDasha SUCCESS - Received ${res.data?.mahadashas?.length || 0} mahadashas`);
            return res;
        }).catch(err => {
            console.error(`[API] generateDasha ERROR:`, err);
            throw err;
        });
    },

    generateOtherDasha: (
        clientId: string,
        type: string,
        ayanamsa: string = 'lahiri',
        level: string = 'mahadasha',
        context: { mahaLord?: string; antarLord?: string; pratyantarLord?: string } = {}
    ): Promise<DashaResponse> => {
        console.log(`[API] generateOtherDasha - Client: ${clientId}, Type: ${type}, Ayanamsa: ${ayanamsa}, Level: ${level}`);
        return apiFetch(`${CLIENT_URL}/clients/${clientId}/dasha/${type}`, {
            method: 'POST',
            body: JSON.stringify({ ayanamsa, level, save: false, ...context }),
        }).then((response: any) => {
            const normalizedData: DashaResponse = {
                clientId: response.clientId || clientId,
                clientName: response.clientName || '',
                level: response.level || 'mahadasha',
                ayanamsa: response.ayanamsa || ayanamsa,
                data: {
                    ...response,
                    mahadashas: extractPeriodsArray(response),
                    current_dasha: response.current_dasha || undefined,
                },
                cached: response.cached || (response.cacheSource ? true : false),
                calculatedAt: response.calculatedAt || new Date().toISOString(),
            };
            return normalizedData;
        }).catch((error: Error) => {
            console.warn(`Dasha ${type} not applicable for this chart:`, error.message);
            const emptyResponse: DashaResponse = {
                clientId,
                clientName: '',
                level: 'mahadasha',
                ayanamsa,
                data: {
                    mahadashas: [],
                    current_dasha: undefined,
                },
                cached: false,
                calculatedAt: new Date().toISOString(),
            };
            return emptyResponse;
        });
    },

    generateAshtakavarga: (clientId: string, ayanamsa: string = 'lahiri', type: string = 'bhinna'): Promise<AshtakavargaResponse> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/ashtakavarga`, {
            method: 'POST',
            body: JSON.stringify({ ayanamsa, type }),
        }),

    generateSudarshanChakra: (clientId: string, ayanamsa: string = 'lahiri'): Promise<any> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/sudarshan-chakra`, {
            method: 'POST',
            body: JSON.stringify({ ayanamsa }),
        }),

    getYogaAnalysis: (clientId: string, yogaType: string, ayanamsa: string = 'lahiri'): Promise<any> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/yoga/${yogaType}?ayanamsa=${ayanamsa}`),

    getDoshaAnalysis: (clientId: string, doshaType: string, ayanamsa: string = 'lahiri'): Promise<any> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/dosha/${doshaType}?ayanamsa=${ayanamsa}`),

    getShadbala: (clientId: string): Promise<any> => {
        console.log(`[api.ts] getShadbala requested for: ${clientId}`);
        return apiFetch(`${CLIENT_URL}/clients/${clientId}/charts/generate`, {
            method: 'POST',
            body: JSON.stringify({ chartType: 'shadbala', ayanamsa: 'lahiri' }),
        }).then(res => {
            console.log(`[api.ts] getShadbala response:`, res);
            return res;
        });
    },

    getPushkaraNavamsha: (clientId: string): Promise<any> => {
        console.log(`[api.ts] getPushkaraNavamsha requested for: ${clientId}`);
        return apiFetch(`${CLIENT_URL}/clients/${clientId}/charts/generate`, {
            method: 'POST',
            body: JSON.stringify({ chartType: 'pushkara_navamsha', ayanamsa: 'lahiri' }),
        }).then(res => {
            console.log(`[api.ts] getPushkaraNavamsha response:`, res);
            return res;
        });
    },

    getAvakhadaChakra: (clientId: string): Promise<any> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/charts/generate`, {
            method: 'POST',
            body: JSON.stringify({ chartType: 'avakhada_chakra', ayanamsa: 'universal' }),
        }),

    getSystemCapabilities: (system: string): SystemCapabilities => {
        const CAPABILITIES: Record<string, SystemCapabilities> = {
            lahiri: {
                charts: {
                    divisional: ['D1', 'D2', 'D3', 'D4', 'D7', 'D9', 'D10', 'D12', 'D16', 'D20', 'D24', 'D27', 'D30', 'D40', 'D45', 'D60'],
                    special: ['sudarshana', 'transit', 'shodasha_varga_signs'],
                    lagna: ['moon_chart', 'sun_chart', 'arudha_lagna', 'bhava_lagna', 'hora_lagna', 'sripathi_bhava', 'kp_bhava', 'equal_bhava', 'karkamsha_d1', 'karkamsha_d9', 'gl_chart', 'mandi', 'gulika']
                },
                features: {
                    dasha: ['mahadasha', 'antardasha', 'pratyantardasha', 'sookshma', 'prana'],
                    ashtakavarga: ['bhinna', 'sarva', 'shodasha_summary', 'temporal_maitri', 'karaka_strength'],
                    shadbala: ['shadbala'],
                    compatibility: ['synastry', 'composite', 'progressed'],
                    numerology: ['chaldean', 'lo_shu']
                },
                hasDivisional: true,
                hasAshtakavarga: true,
                hasNumerology: true,
                hasCompatibility: true,
                hasHorary: false,
            },
            raman: {
                charts: {
                    divisional: ['D1', 'D2', 'D3', 'D4', 'D7', 'D9', 'D10', 'D12', 'D16', 'D20', 'D24', 'D27', 'D30', 'D40', 'D45', 'D60'],
                    special: ['sudarshana', 'transit', 'shodasha_varga_signs'],
                    lagna: ['moon_chart', 'sun_chart', 'arudha_lagna', 'bhava_lagna', 'hora_lagna', 'sripathi_bhava', 'kp_bhava', 'equal_bhava', 'karkamsha_d1', 'karkamsha_d9']
                },
                features: {
                    dasha: ['mahadasha', 'antardasha', 'pratyantardasha', 'sookshma', 'prana'],
                    ashtakavarga: ['bhinna', 'sarva', 'shodasha_varga'],
                    shadbala: [],
                    compatibility: [],
                    numerology: []
                },
                hasDivisional: true,
                hasAshtakavarga: true,
                hasNumerology: false,
                hasCompatibility: false,
                hasHorary: false,
            },
            kp: {
                charts: {
                    divisional: ['D1', 'D2', 'D3', 'D4', 'D7', 'D9', 'D10', 'D12', 'D16', 'D20', 'D24', 'D27', 'D30', 'D40', 'D45', 'D60'],
                    special: ['planets_cusps', 'shodasha_varga'],
                    lagna: ['moon_chart', 'sun_chart', 'arudha_lagna', 'bhava_lagna', 'hora_lagna', 'sripathi_bhava', 'kp_bhava', 'equal_bhava', 'karkamsha_d1', 'karkamsha_d9', 'gl_chart', 'mandi', 'gulika']
                },
                features: {
                    dasha: ['mahadasha', 'antardasha', 'pratyantardasha', 'sookshma', 'prana'],
                    ashtakavarga: ['shodasha_varga'],
                    shadbala: [],
                    compatibility: [],
                    numerology: []
                },
                hasDivisional: true,
                hasAshtakavarga: false,
                hasNumerology: false,
                hasCompatibility: false,
                hasHorary: true,
            },
            yukteswar: {
                charts: {
                    divisional: ['D1', 'D2', 'D3', 'D4', 'D7', 'D9', 'D10', 'D12', 'D16', 'D20', 'D24', 'D27', 'D30', 'D40', 'D45', 'D60'],
                    special: ['equal_chart', 'sudarshana', 'transit', 'sripathi_bhava', 'kp_bhava', 'arudha_lagna', 'bhava_lagna', 'hora_lagna', 'karkamsha_d1', 'karkamsha_d9'],
                    lagna: ['moon_chart', 'sun_chart', 'arudha_lagna', 'bhava_lagna', 'hora_lagna', 'sripathi_bhava', 'kp_bhava', 'equal_bhava', 'karkamsha_d1', 'karkamsha_d9', 'gl_chart']
                },
                features: {
                    dasha: ['mahadasha', 'antardasha', 'pratyantardasha', 'sookshma', 'prana', 'tribhagi', 'yogini', 'ashtottari'],
                    ashtakavarga: ['bhinna', 'sarva', 'shodasha_summary'],
                    shadbala: [],
                    compatibility: [],
                    numerology: []
                },
                hasDivisional: true,
                hasAshtakavarga: true,
                hasNumerology: false,
                hasCompatibility: false,
                hasHorary: false,
            },
            bhasin: {
                charts: {
                    divisional: ['D1', 'D2', 'D3', 'D4', 'D7', 'D9', 'D10', 'D12', 'D16', 'D20', 'D24', 'D27', 'D30', 'D40', 'D45', 'D60'],
                    special: ['sudarshana', 'transit', 'shodasha_varga_signs'],
                    lagna: ['moon_chart', 'sun_chart', 'arudha_lagna', 'bhava_lagna', 'hora_lagna', 'sripathi_bhava', 'kp_bhava', 'equal_bhava', 'karkamsha_d1', 'karkamsha_d9', 'gl_chart']
                },
                features: {
                    dasha: ['mahadasha', 'antardasha', 'pratyantardasha', 'sookshma', 'prana', 'ashtottari'],
                    ashtakavarga: ['bhinna', 'sarva', 'shodasha_summary'],
                    shadbala: [],
                    compatibility: [],
                    numerology: []
                },
                hasDivisional: true,
                hasAshtakavarga: true,
                hasNumerology: false,
                hasCompatibility: false,
                hasHorary: false,
            },
        };
        return CAPABILITIES[system.toLowerCase()] || CAPABILITIES.lahiri;
    },
};

// ============ FAMILY API ============
export const familyApi = {
    getFamilyLinks: (clientId: string): Promise<FamilyLink[]> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/family`),

    linkFamily: (clientId: string, data: FamilyLinkPayload): Promise<{ success: boolean }> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/family-link`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    unlinkFamily: (clientId: string, relatedClientId: string): Promise<{ success: boolean }> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/family/${relatedClientId}`, {
            method: 'DELETE',
        }),
};

// ============ GEOCODE API ============
export const geocodeApi = {
    getSuggestions: (query: string, limit: number = 5): Promise<{ suggestions: LocationSuggestion[] }> =>
        apiFetch(`${CLIENT_URL}/geocode/suggest?q=${encodeURIComponent(query)}&limit=${limit}`),

    geocodePlace: (place: string): Promise<LocationSuggestion> =>
        apiFetch(`${CLIENT_URL}/geocode`, {
            method: 'POST',
            body: JSON.stringify({ place }),
        }),
};

// ============ RAMAN API ============
export const ramanApi = {
    getNatalChart: (clientId: string): Promise<any> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/raman/natal`, {
            method: 'GET'
        }).catch(err => {
            console.error("Raman fetch failed", err);
            throw err;
        }),

    getNatal: (clientId: string): Promise<any> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/raman/natal`, {
            method: 'POST'
        }),

    getTransit: (clientId: string): Promise<any> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/raman/transit`, {
            method: 'POST'
        }),

    getDivisional: (clientId: string, type: string): Promise<any> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/raman/divisional/${type}`, {
            method: 'POST'
        }),

    getAshtakavarga: (clientId: string, type: 'bhinna-ashtakavarga' | 'sarva-ashtakavarga' | 'shodasha-varga'): Promise<any> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/raman/${type}`, {
            method: 'POST'
        }),

    getDasha: (clientId: string, level: 'maha-antar' | 'pratyantar' | 'sookshma' | 'prana'): Promise<any> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/raman/dasha/${level}`, {
            method: 'POST'
        }),

    getLagnaChart: (clientId: string, type: string): Promise<any> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/raman/${type}`, {
            method: 'POST'
        }),
};

// ============ KP (KRISHNAMURTI PADDHATI) API ============
// KP System endpoints for stellar astrology
export const kpApi = {
    getPlanetsCusps: (clientId: string): Promise<KpPlanetsCuspsResponse> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/kp/planets-cusps`, {
            method: 'POST'
        }),

    getRulingPlanets: (clientId: string): Promise<KpRulingPlanetsResponse> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/kp/ruling-planets`, {
            method: 'POST'
        }),

    getBhavaDetails: (clientId: string): Promise<KpBhavaDetailsResponse> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/kp/bhava-details`, {
            method: 'POST'
        }),

    getSignifications: (clientId: string): Promise<KpSignificationsResponse> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/kp/significations`, {
            method: 'POST'
        }),

    getHouseSignifications: (clientId: string): Promise<KpSignificationsResponse> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/kp/house-significations`, {
            method: 'POST'
        }),

    getPlanetSignificators: (clientId: string): Promise<KpSignificationsResponse> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/kp/planets-significators`, {
            method: 'POST'
        }),

    getInterlinks: (clientId: string): Promise<any> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/kp/interlinks`, {
            method: 'POST'
        }),

    getAdvancedInterlinks: (clientId: string): Promise<any> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/kp/interlinks-advanced`, {
            method: 'POST'
        }),

    getNakshatraNadi: (clientId: string): Promise<any> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/kp/nakshatra-nadi`, {
            method: 'POST'
        }),

    getFortuna: (clientId: string): Promise<any> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/kp/fortuna`, {
            method: 'POST'
        }),

    getHorary: (clientId: string, horaryNumber: number, question: string): Promise<KpHoraryResponse> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/kp/horary`, {
            method: 'POST',
            body: JSON.stringify({ horaryNumber, question }),
        }),

    getShadbala: (clientId: string): Promise<any> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/charts/generate`, {
            method: 'POST',
            body: JSON.stringify({ chartType: 'shadbala', ayanamsa: 'lahiri' }),
        }),
};
