// Matchmaking API — Ashta Koota (Gun Milan) analysis and saved matches

import { apiFetch } from './core';
import type { BirthDetails, MatchResult, SavedMatch } from '@/types/matchmaking.types';

const GATEWAY_URL = process.env.NEXT_PUBLIC_CLIENT_SERVICE_URL || 'http://localhost:8080/api/v1';

// ============ STORAGE (interim — localStorage until backend CRUD exists) ============

const SAVED_MATCHES_KEY = 'grahvani_saved_matches';

function loadSavedMatches(): SavedMatch[] {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(SAVED_MATCHES_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function persistSavedMatches(matches: SavedMatch[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SAVED_MATCHES_KEY, JSON.stringify(matches));
}

// ============ BIRTH DATA CONVERSION ============

function toBirthData(details: BirthDetails) {
    return {
        userName: details.name,
        birthDate: details.dateOfBirth,
        birthTime: details.timeOfBirth + ':00',
        latitude: details.latitude ?? 28.6139,
        longitude: details.longitude ?? 77.209,
        timezoneOffset: 5.5,
    };
}

// ============ API ============

export const matchmakingApi = {
    /**
     * Analyze compatibility between two birth profiles.
     * Calls the backend synastry endpoint and normalizes the response
     * into the MatchResult shape expected by the UI.
     */
    analyze: async (bride: BirthDetails, groom: BirthDetails): Promise<MatchResult> => {
        const response = await apiFetch<Record<string, unknown>>(
            `${GATEWAY_URL}/compatibility/synastry`,
            {
                method: 'POST',
                body: JSON.stringify({
                    person1: toBirthData(bride),
                    person2: toBirthData(groom),
                }),
            },
        );

        return normalizeMatchResult(response, bride, groom);
    },

    /** List all saved matches (localStorage interim). */
    listSaved: async (): Promise<SavedMatch[]> => {
        return loadSavedMatches();
    },

    /** Get a single saved match by ID. */
    getSaved: async (id: string): Promise<SavedMatch | null> => {
        return loadSavedMatches().find(m => m.id === id) ?? null;
    },

    /** Save a match result. */
    saveMatch: async (result: MatchResult, notes?: string): Promise<SavedMatch> => {
        const saved: SavedMatch = {
            id: crypto.randomUUID(),
            result,
            notes,
            savedAt: new Date().toISOString(),
        };
        const all = loadSavedMatches();
        all.unshift(saved);
        persistSavedMatches(all);
        return saved;
    },

    /** Delete a saved match by ID. */
    deleteMatch: async (id: string): Promise<void> => {
        const all = loadSavedMatches().filter(m => m.id !== id);
        persistSavedMatches(all);
    },
};

// ============ RESPONSE NORMALIZER ============

function normalizeMatchResult(
    response: Record<string, unknown>,
    bride: BirthDetails,
    groom: BirthDetails,
): MatchResult {
    const data = (response.data || response) as Record<string, unknown>;

    // Try to extract Ashta Koota scores from backend response.
    // The synastry endpoint may return them under various keys.
    const kootaData = (data.ashtaKoota || data.gunMilan || data.koota) as Record<string, unknown>[] | undefined;
    const kootas = extractKootas(kootaData);
    const totalScore = kootas.reduce((sum, k) => sum + k.obtainedScore, 0);

    const manglik = (data.manglik || data.manglikStatus) as Record<string, unknown> | undefined;
    const doshas = (data.doshas || data.dosha) as Record<string, unknown> | undefined;

    const verdict = totalScore >= 28 ? 'excellent'
        : totalScore >= 18 ? 'good'
        : totalScore >= 10 ? 'average'
        : 'below_average';

    return {
        id: crypto.randomUUID(),
        bride,
        groom,
        totalScore,
        maxScore: 36,
        kootas,
        overallVerdict: verdict as MatchResult['overallVerdict'],
        manglikStatus: {
            bride: Boolean(manglik?.person1 ?? manglik?.bride),
            groom: Boolean(manglik?.person2 ?? manglik?.groom),
            cancelled: Boolean(manglik?.cancelled),
        },
        naadiDosha: Boolean(doshas?.naadi ?? doshas?.naadiDosha),
        bhakootDosha: Boolean(doshas?.bhakoot ?? doshas?.bhakootDosha),
        recommendations: extractRecommendations(data),
        createdAt: new Date().toISOString(),
    };
}

const KOOTA_DEFAULTS: { name: string; maxScore: number; description: string }[] = [
    { name: 'Varna', maxScore: 1, description: 'Spiritual compatibility and ego levels' },
    { name: 'Vashya', maxScore: 2, description: 'Mutual attraction and dominance patterns' },
    { name: 'Tara', maxScore: 3, description: 'Destiny compatibility and fortune alignment' },
    { name: 'Yoni', maxScore: 4, description: 'Physical and sexual compatibility' },
    { name: 'Graha Maitri', maxScore: 5, description: 'Mental wavelength and friendship' },
    { name: 'Gana', maxScore: 6, description: 'Temperament compatibility' },
    { name: 'Bhakoot', maxScore: 7, description: 'Love, family welfare, and financial prosperity' },
    { name: 'Naadi', maxScore: 8, description: 'Health, genes, and progeny compatibility' },
];

function extractKootas(data: Record<string, unknown>[] | undefined): MatchResult['kootas'] {
    if (Array.isArray(data) && data.length > 0) {
        return KOOTA_DEFAULTS.map((def, i) => {
            const item = data[i] as Record<string, unknown> | undefined;
            return {
                name: String(item?.name ?? def.name),
                maxScore: def.maxScore,
                obtainedScore: Number(item?.score ?? item?.obtainedScore ?? 0),
                description: String(item?.description ?? def.description),
            };
        });
    }

    // Backend didn't return koota breakdown — return zeros
    return KOOTA_DEFAULTS.map(def => ({
        ...def,
        obtainedScore: 0,
    }));
}

function extractRecommendations(data: Record<string, unknown>): string[] {
    const recs = data.recommendations || data.suggestions;
    if (Array.isArray(recs)) return recs.map(String);
    return [];
}
