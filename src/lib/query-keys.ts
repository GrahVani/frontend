// Centralized query key factory (ST-010)
// Single source of truth for all TanStack Query cache keys.
// Usage: import { queryKeys } from '@/lib/query-keys'
//        queryKey: queryKeys.clients.list(params)

import type { ClientQueryParams } from '@/hooks/queries/useClients';

export const queryKeys = {
    // Auth & User
    userProfile: ['userProfile'] as const,

    // Clients
    clients: {
        all: ['clients'] as const,
        list: (params: ClientQueryParams) => ['clients', params] as const,
        detail: (id: string) => ['client', id] as const,
    },

    // Charts
    charts: {
        all: ['charts'] as const,
        byClient: (clientId: string) => ['charts', clientId] as const,
    },

    // Calculations
    dasha: {
        basic: (clientId: string, type: string, ayanamsa: string, context?: Record<string, unknown>) =>
            ['dasha', clientId, type, ayanamsa, context] as const,
        other: (clientId: string, type: string, ayanamsa: string, level: string, context: Record<string, unknown>) =>
            ['dasha', 'other', clientId, type, ayanamsa, level, context] as const,
    },
    sudarshan: (clientId: string, ayanamsa: string) => ['sudarshan', clientId, ayanamsa] as const,
    ashtakavarga: (clientId: string, ayanamsa: string, type: string) => ['ashtakavarga', clientId, ayanamsa, type] as const,
    shadbala: (clientId: string) => ['shadbala', clientId] as const,

    // KP System
    kp: {
        all: ['kp'] as const,
        planetsCusps: (clientId: string) => ['kp', 'planets-cusps', clientId] as const,
        rulingPlanets: (clientId: string) => ['kp', 'ruling-planets', clientId] as const,
        bhavaDetails: (clientId: string) => ['kp', 'bhava-details', clientId] as const,
        significations: (clientId: string) => ['kp', 'significations', clientId] as const,
        houseSignifications: (clientId: string) => ['kp', 'house-significations', clientId] as const,
        planetSignificators: (clientId: string) => ['kp', 'planet-significators', clientId] as const,
        horary: (clientId: string, horaryNumber: number) => ['kp', 'horary', clientId, horaryNumber] as const,
        interlinks: (clientId: string) => ['kp', 'interlinks', clientId] as const,
        advancedInterlinks: (clientId: string) => ['kp', 'interlinks-advanced', clientId] as const,
        nakshatraNadi: (clientId: string) => ['kp', 'nakshatra-nadi', clientId] as const,
        fortuna: (clientId: string) => ['kp', 'fortuna', clientId] as const,
    },

    // Raman
    raman: {
        all: ['ramanChart'] as const,
        natal: (clientId: string) => ['ramanChart', 'natal', clientId] as const,
    },

    // Family
    family: {
        links: (clientId: string) => ['familyLinks', clientId] as const,
    },

    // Location / Geocode
    locations: {
        suggestions: (query: string) => ['locationSuggestions', query] as const,
    },

    // Calendar
    calendar: {
        monthly: (year: number, month: number) => ['calendar', 'monthly', year, month] as const,
        transits: (year: number, month: number) => ['calendar', 'transits', year, month] as const,
        festivals: (year: number) => ['calendar', 'festivals', year] as const,
        personal: (year: number, month: number) => ['calendar', 'personal', year, month] as const,
        personalAll: ['calendar', 'personal'] as const,
    },

    // Matchmaking
    matchmaking: {
        analysis: (bride: unknown, groom: unknown) => ['matchmaking', 'analysis', bride, groom] as const,
        saved: ['matchmaking', 'saved'] as const,
        detail: (id: string) => ['matchmaking', 'detail', id] as const,
    },

    // Muhurta
    muhurta: {
        daily: (date: string) => ['muhurta', 'daily', date] as const,
        search: (filters: unknown) => ['muhurta', 'search', filters] as const,
        category: (category: string, startDate?: string, endDate?: string) => ['muhurta', category, startDate, endDate] as const,
    },

    // Panchang
    panchang: {
        daily: (date: string) => ['panchang', date] as const,
        monthly: (year: number, month: number) => ['panchang', 'monthly', year, month] as const,
        choghadiya: (date: string) => ['panchang', 'choghadiya', date] as const,
        hora: (date: string) => ['panchang', 'hora', date] as const,
        lagna: (date: string) => ['panchang', 'lagna', date] as const,
    },

    // Dashboard
    dashboard: {
        stats: ['dashboard', 'stats'] as const,
    },

    // Numerology
    numerology: {
        service: (category: string, slug: string, inputHash: string) =>
            ['numerology', category, slug, inputHash] as const,
        raw: (slug: string, inputHash: string) =>
            ['numerology', 'raw', slug, inputHash] as const,
    },

    // Knowledge (educational tooltips)
    knowledge: {
        all: ['knowledge'] as const,
        term: (termKey: string) => ['knowledge', 'term', termKey] as const,
        batch: (keys: string[]) => ['knowledge', 'batch', keys.sort().join(',')] as const,
        search: (q: string, domain?: string) => ['knowledge', 'search', q, domain] as const,
        stats: ['knowledge', 'stats'] as const,
    },
} as const;
