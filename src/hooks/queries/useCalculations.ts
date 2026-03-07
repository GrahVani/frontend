import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { clientApi } from "@/lib/api";
import { useMemo } from 'react';

export function useDasha(
    clientId: string,
    type: 'basic' | 'deep' | 'tree' | 'mahadasha' | 'antardasha' | 'pratyantardasha' | 'sookshma' | 'prana' = 'basic',
    ayanamsa: string,
    context?: Record<string, unknown>
) {
    return useQuery({
        queryKey: ['dasha', clientId, type, ayanamsa, context],
        queryFn: async () => {
            if (!clientId) throw new Error("Client ID required");
            return await clientApi.generateDasha(clientId, type, ayanamsa, false, context);
        },
        enabled: !!clientId,
        staleTime: 1000 * 60 * 60, // 1 hour
        placeholderData: keepPreviousData,
    });
}

export function useOtherDasha(
    clientId: string,
    type: string,
    ayanamsa: string,
    level: string = 'mahadasha',
    context: Record<string, unknown> = {}
) {
    return useQuery({
        queryKey: ['dasha', 'other', clientId, type, ayanamsa, level, context],
        queryFn: async () => {
            if (!clientId) throw new Error("Client ID required");
            return await clientApi.generateOtherDasha(clientId, type, ayanamsa, level, context);
        },
        enabled: !!clientId && type !== 'vimshottari',
        staleTime: 1000 * 60 * 60, // 1 hour
        placeholderData: keepPreviousData,
    });
}

export function useSudarshanChakra(clientId: string, ayanamsa: string) {
    return useQuery({
        queryKey: ['sudarshan', clientId, ayanamsa],
        queryFn: async () => {
            if (!clientId) throw new Error("Client ID required");
            return await clientApi.generateSudarshanChakra(clientId, ayanamsa);
        },
        enabled: !!clientId,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}

export function useAshtakavarga(clientId: string, ayanamsa: string, type: string = 'bhinna') {
    return useQuery({
        queryKey: ['ashtakavarga', clientId, ayanamsa, type],
        queryFn: async () => {
            if (!clientId) throw new Error("Client ID required");
            return await clientApi.generateAshtakavarga(clientId, ayanamsa, type);
        },
        enabled: !!clientId,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}

export function useShadbala(clientId: string) {
    return useQuery({
        queryKey: ['shadbala', clientId],
        queryFn: async () => {
            if (!clientId) throw new Error("Client ID required");
            return await clientApi.getShadbala(clientId);
        },
        enabled: !!clientId,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}

export function useSystemCapabilities(system: string) {
    return useMemo(() => clientApi.getSystemCapabilities(system), [system]);
}

export function useKpPlanetsCusps(clientId: string) {
    return useQuery({
        queryKey: ['kp-planets-cusps', clientId],
        queryFn: async () => {
            if (!clientId) throw new Error("Client ID required");
            return await clientApi.kpApi.getPlanetsCusps(clientId);
        },
        enabled: !!clientId,
        staleTime: 1000 * 60 * 60,
    });
}

export function useKpRulingPlanets(clientId: string) {
    return useQuery({
        queryKey: ['kp-ruling-planets', clientId],
        queryFn: async () => {
            if (!clientId) throw new Error("Client ID required");
            return await clientApi.kpApi.getRulingPlanets(clientId);
        },
        enabled: !!clientId,
        staleTime: 1000 * 60 * 5, // 5 mins (Ruling planets are time-sensitive)
    });
}

export function useKpBhavaDetails(clientId: string) {
    return useQuery({
        queryKey: ['kp-bhava-details', clientId],
        queryFn: async () => {
            if (!clientId) throw new Error("Client ID required");
            return await clientApi.kpApi.getBhavaDetails(clientId);
        },
        enabled: !!clientId,
        staleTime: 1000 * 60 * 60,
    });
}

export function useKpSignifications(clientId: string) {
    return useQuery({
        queryKey: ['kp-significations', clientId],
        queryFn: async () => {
            if (!clientId) throw new Error("Client ID required");
            return await clientApi.kpApi.getSignifications(clientId);
        },
        enabled: !!clientId,
        staleTime: 1000 * 60 * 60,
    });
}
