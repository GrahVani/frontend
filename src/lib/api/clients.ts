// Client API — CRUD, charts, dasha, ashtakavarga, yoga, dosha, capabilities

import { apiFetch, CLIENT_URL } from './core';
import { extractPeriodsArray } from '../dasha-utils';
import type { CreateClientPayload, Client, ClientListResponse, LocationSuggestion } from '@/types/client';
import type { AstrologicalReport } from '@/types/astrology';
import type { RawDoshaResponse } from '@/types/dosha.types';
import type { RawYogaResponse } from '@/types/yoga.types';
import type {
    ChartRecord, ChartGenerateResponse, SudarshanChakraResponse,
    DashaResponse, DashaPeriod, AshtakavargaResponse, SystemCapabilities,
} from './types';

export const clientApi = {
    // ---- Client CRUD ----
    getClients: (params?: {
        page?: number;
        limit?: number;
        search?: string;
        gender?: string;
        city?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
        myClientsOnly?: boolean;
    }): Promise<ClientListResponse> => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set('page', String(params.page));
        if (params?.limit) searchParams.set('limit', String(params.limit));
        if (params?.search) searchParams.set('search', params.search);
        if (params?.gender) searchParams.set('gender', params.gender);
        if (params?.city) searchParams.set('city', params.city);
        if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
        if (params?.sortOrder) searchParams.set('sortOrder', params.sortOrder);
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

    // ---- Charts ----
    getCharts: (clientId: string): Promise<ChartRecord[]> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/charts`),

    generateChart: (clientId: string, chartType: string = 'D1', ayanamsa: string = 'lahiri', options: Record<string, unknown> = {}): Promise<ChartGenerateResponse> => {
        const LAGNA_CHARTS = ['moon_chart', 'sun_chart', 'arudha_lagna', 'bhava_lagna', 'hora_lagna', 'sripathi_bhava', 'kp_bhava', 'equal_bhava', 'karkamsha_d1', 'karkamsha_d9', 'gl_chart', 'mandi', 'gulika', 'upapada_lagna', 'swamsha', 'pada_chart'];
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

    generateDailyTransit: (clientId: string, startDate: string, endDate: string): Promise<ChartGenerateResponse> =>
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

    // ---- Dasha ----
    generateDasha: (
        clientId: string,
        level: string = 'mahadasha',
        ayanamsa: string = 'lahiri',
        save: boolean = false,
        context: { mahaLord?: string; antarLord?: string; pratyantarLord?: string; drillDownPath?: string[] } = {}
    ): Promise<DashaResponse> => {
        return apiFetch<DashaResponse>(`${CLIENT_URL}/clients/${clientId}/dasha`, {
            method: 'POST',
            body: JSON.stringify({ level, ayanamsa, save, ...context }),
        }).then(res => {
            return res;
        }).catch(err => {
            throw err;
        });
    },

    generateOtherDasha: (
        clientId: string,
        type: string,
        ayanamsa: string = 'lahiri',
        level: string = 'mahadasha',
        save: boolean = false,
        context: { mahaLord?: string; antarLord?: string; pratyantarLord?: string } = {}
    ): Promise<DashaResponse> => {
        return apiFetch<Record<string, unknown>>(`${CLIENT_URL}/clients/${clientId}/dasha/${type}`, {
            method: 'POST',
            body: JSON.stringify({ ayanamsa, level, save, ...context }),
        }).then((response: Record<string, unknown>) => {
            const res = response as Record<string, unknown>;
            const normalizedData: DashaResponse = {
                clientId: (res.clientId as string) || clientId,
                clientName: (res.clientName as string) || '',
                level: (res.level as string) || 'mahadasha',
                ayanamsa: (res.ayanamsa as string) || ayanamsa,
                data: {
                    mahadashas: extractPeriodsArray(response as Parameters<typeof extractPeriodsArray>[0]) as unknown as DashaPeriod[],
                    current_dasha: (res.current_dasha as DashaPeriod | undefined) || undefined,
                },
                cached: (res.cached as boolean) || (res.cacheSource ? true : false),
                calculatedAt: (res.calculatedAt as string) || new Date().toISOString(),
            };
            return normalizedData;
        }).catch((error: Error) => {
            // API-005 FIX: Throw the error instead of fabricating empty data.
            throw error;
        });
    },

    // ---- Ashtakavarga ----
    generateAshtakavarga: (clientId: string, ayanamsa: string = 'lahiri', type: string = 'bhinna'): Promise<AshtakavargaResponse> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/ashtakavarga`, {
            method: 'POST',
            body: JSON.stringify({ ayanamsa, type }),
        }),

    // ---- Special Charts ----
    generateSudarshanChakra: (clientId: string, ayanamsa: string = 'lahiri'): Promise<SudarshanChakraResponse> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/sudarshan-chakra`, {
            method: 'POST',
            body: JSON.stringify({ ayanamsa }),
        }),

    // ---- Yoga & Dosha ----
    getYogaAnalysis: (clientId: string, yogaType: string, ayanamsa: string = 'lahiri'): Promise<AstrologicalReport<RawYogaResponse>> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/yoga/${yogaType}?ayanamsa=${ayanamsa}`),

    getDoshaAnalysis: (clientId: string, doshaType: string, ayanamsa: string = 'lahiri'): Promise<AstrologicalReport<RawDoshaResponse>> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/dosha/${doshaType}?ayanamsa=${ayanamsa}`),

    // ---- Strength Analysis ----
    getShadbala: (clientId: string): Promise<ChartGenerateResponse> => {
        return apiFetch<ChartGenerateResponse>(`${CLIENT_URL}/clients/${clientId}/charts/generate`, {
            method: 'POST',
            body: JSON.stringify({ chartType: 'shadbala', ayanamsa: 'lahiri' }),
        }).then(res => {
            return res;
        });
    },

    getPushkaraNavamsha: (clientId: string): Promise<ChartGenerateResponse> => {
        return apiFetch<ChartGenerateResponse>(`${CLIENT_URL}/clients/${clientId}/charts/generate`, {
            method: 'POST',
            body: JSON.stringify({ chartType: 'pushkara_navamsha', ayanamsa: 'lahiri' }),
        }).then(res => {
            return res;
        });
    },

    getCharaKarakas: (clientId: string): Promise<ChartGenerateResponse> => {
        return apiFetch<ChartGenerateResponse>(`${CLIENT_URL}/clients/${clientId}/charts/generate`, {
            method: 'POST',
            body: JSON.stringify({ chartType: 'chara_karakas', ayanamsa: 'lahiri' }),
        }).then(res => {
            return res;
        });
    },

    getAvakhadaChakra: (clientId: string): Promise<ChartGenerateResponse> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/charts/generate`, {
            method: 'POST',
            body: JSON.stringify({ chartType: 'avakhada_chakra', ayanamsa: 'universal' }),
        }),

    // ---- System Capabilities ----
    getSystemCapabilities: (system: string): SystemCapabilities => {
        const CAPABILITIES: Record<string, SystemCapabilities> = {
            lahiri: {
                charts: {
                    divisional: ['D1', 'D2', 'D3', 'D4', 'D7', 'D9', 'D10', 'D12', 'D16', 'D20', 'D24', 'D27', 'D30', 'D40', 'D45', 'D60'],
                    special: ['sudarshana', 'transit', 'shodasha_varga_signs'],
                    lagna: ['moon_chart', 'sun_chart', 'arudha_lagna', 'bhava_lagna', 'hora_lagna', 'sripathi_bhava', 'kp_bhava', 'equal_bhava', 'karkamsha_d1', 'karkamsha_d9', 'gl_chart', 'mandi', 'gulika', 'upapada_lagna', 'swamsha', 'pada_chart'],
                    rare_shodash: ['d2_somanatha', 'd2_kashinatha', 'd4_vedamsha', 'd6_kaulaka', 'd9_nadhi', 'd9_pada_special', 'd9_somanatha', 'd24_parasidamsha', 'd24_siddhamsha', 'd30_venkatesha', 'd108_nd', 'd108_dn']
                },
                features: {
                    dasha: ['mahadasha', 'antardasha', 'pratyantardasha', 'sookshma', 'prana'],
                    ashtakavarga: ['bhinna', 'sarva', 'shodasha_summary', 'temporal_maitri', 'panchadha_maitri'],
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
                    ashtakavarga: ['shodasha_summary'],
                    shadbala: [],
                    compatibility: [],
                    numerology: []
                },
                hasDivisional: true,
                hasAshtakavarga: true,
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
                    special: ['sudarshana', 'transit'],
                    lagna: ['moon_chart', 'sun_chart', 'arudha_lagna', 'bhava_lagna', 'hora_lagna', 'sripathi_bhava', 'kp_bhava', 'equal_bhava', 'karkamsha_d1', 'karkamsha_d9', 'gl_chart']
                },
                features: {
                    dasha: ['mahadasha', 'antardasha', 'pratyantardasha', 'sookshma', 'prana', 'ashtottari'],
                    ashtakavarga: ['bhinna', 'sarva'],
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
