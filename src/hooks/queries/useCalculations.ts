import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { clientApi } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { useMemo } from 'react';

export function useDasha(
    clientId: string,
    type: 'basic' | 'deep' | 'tree' | 'mahadasha' | 'antardasha' | 'pratyantardasha' | 'sookshma' | 'prana' = 'basic',
    ayanamsa: string,
    context?: Record<string, unknown>
) {
    return useQuery({
        queryKey: queryKeys.dasha.basic(clientId, type, ayanamsa, context),
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
        queryKey: queryKeys.dasha.other(clientId, type, ayanamsa, level, context),
        queryFn: async () => {
            if (!clientId) throw new Error("Client ID required");
            return await clientApi.generateOtherDasha(clientId, type, ayanamsa, level, false, context);
        },
        enabled: !!clientId && type !== 'vimshottari',
        staleTime: 1000 * 60 * 60, // 1 hour
        placeholderData: keepPreviousData,
    });
}

export function useSudarshanChakra(clientId: string, ayanamsa: string) {
    return useQuery({
        queryKey: queryKeys.sudarshan(clientId, ayanamsa),
        queryFn: async () => {
            if (!clientId) throw new Error("Client ID required");
            return await clientApi.generateSudarshanChakra(clientId, ayanamsa);
        },
        enabled: !!clientId,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}

export function useAshtakavarga(clientId: string, ayanamsa: string, type: string = 'bhinna', options: { enabled?: boolean } = {}) {
    return useQuery({
        queryKey: queryKeys.ashtakavarga(clientId, ayanamsa, type),
        queryFn: async () => {
            if (!clientId) throw new Error("Client ID required");
            return await clientApi.generateAshtakavarga(clientId, ayanamsa, type);
        },
        enabled: (options.enabled !== undefined ? options.enabled : true) && !!clientId,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}

export function useShadbala(clientId: string) {
    return useQuery({
        queryKey: queryKeys.shadbala(clientId),
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
