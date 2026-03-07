// KP (Krishnamurti Paddhati) API endpoints

import { apiFetch, CLIENT_URL } from './core';
import type {
    KpPlanetsCuspsResponse,
    KpRulingPlanetsResponse,
    KpBhavaDetailsResponse,
    KpSignificationsResponse,
    KpHoraryResponse,
    KpFortunaResponse,
    KpNakshatraNadiResponse,
} from '@/types/kp.types';
import type { KpInterlinkResponse } from './types';

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

    getInterlinks: (clientId: string): Promise<KpInterlinkResponse> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/kp/interlinks`, {
            method: 'POST'
        }),

    getAdvancedInterlinks: (clientId: string): Promise<KpInterlinkResponse> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/kp/interlinks-advanced`, {
            method: 'POST'
        }),

    getNakshatraNadi: (clientId: string): Promise<KpNakshatraNadiResponse> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/kp/nakshatra-nadi`, {
            method: 'POST'
        }),

    getFortuna: (clientId: string): Promise<KpFortunaResponse> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/kp/fortuna`, {
            method: 'POST'
        }),

    getHorary: (clientId: string, horaryNumber: number, question: string): Promise<KpHoraryResponse> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/kp/horary`, {
            method: 'POST',
            body: JSON.stringify({ horaryNumber, question }),
        }),
};
