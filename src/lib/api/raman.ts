// Raman (B.V. Raman ayanamsa) API endpoints

import { apiFetch, CLIENT_URL } from './core';
import type { RamanNatalResponse, RamanApiResponse } from '@/types/raman';

export const ramanApi = {
    getNatalChart: (clientId: string): Promise<RamanApiResponse<RamanNatalResponse>> =>
        apiFetch<RamanApiResponse<RamanNatalResponse>>(`${CLIENT_URL}/clients/${clientId}/raman/natal`, {
            method: 'GET'
        }).catch(err => {
            throw err;
        }),

    getNatal: (clientId: string): Promise<RamanApiResponse<RamanNatalResponse>> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/raman/natal`, {
            method: 'POST'
        }),

    getTransit: (clientId: string): Promise<RamanApiResponse<Record<string, unknown>>> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/raman/transit`, {
            method: 'POST'
        }),

    getDivisional: (clientId: string, type: string): Promise<RamanApiResponse<Record<string, unknown>>> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/raman/divisional/${type}`, {
            method: 'POST'
        }),

    getAshtakavarga: (clientId: string, type: 'bhinna-ashtakavarga' | 'sarva-ashtakavarga' | 'shodasha-varga'): Promise<RamanApiResponse<Record<string, unknown>>> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/raman/${type}`, {
            method: 'POST'
        }),

    getDasha: (clientId: string, level: 'maha-antar' | 'pratyantar' | 'sookshma' | 'prana'): Promise<RamanApiResponse<Record<string, unknown>>> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/raman/dasha/${level}`, {
            method: 'POST'
        }),

    getLagnaChart: (clientId: string, type: string): Promise<RamanApiResponse<Record<string, unknown>>> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/raman/${type}`, {
            method: 'POST'
        }),
};
