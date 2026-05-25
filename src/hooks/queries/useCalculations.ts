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

export function useLalKitabHousePosition(clientId: string) {
    return useQuery({
        queryKey: queryKeys.lalKitab.housePosition(clientId),
        queryFn: async () => {
            if (!clientId) throw new Error("Client ID required");
            return await clientApi.getLalKitabHousePosition(clientId);
        },
        enabled: !!clientId,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}

export function useLalKitabPlanetaryPosition(clientId: string) {
    return useQuery({
        queryKey: queryKeys.lalKitab.planetaryPosition(clientId),
        queryFn: async () => {
            if (!clientId) throw new Error("Client ID required");
            return await clientApi.getLalKitabPlanetaryPosition(clientId);
        },
        enabled: !!clientId,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}

export function useLalKitabDasha(clientId: string) {
    return useQuery({
        queryKey: queryKeys.lalKitab.dasha(clientId),
        queryFn: async () => {
            if (!clientId) throw new Error("Client ID required");
            return await clientApi.getLalKitabDasha(clientId);
        },
        enabled: !!clientId,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}

export function useLalKitabTeva(clientId: string) {
    return useQuery({
        queryKey: queryKeys.lalKitab.teva(clientId),
        queryFn: async () => {
            if (!clientId) throw new Error("Client ID required");
            return await clientApi.getLalKitabTeva(clientId);
        },
        enabled: !!clientId,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}

export function useLalKitabVarshphalTimeline(clientId: string) {
    return useQuery({
        queryKey: queryKeys.lalKitab.varshphalTimeline(clientId),
        queryFn: async () => {
            if (!clientId) throw new Error("Client ID required");
            return await clientApi.getLalKitabVarshphalTimeline(clientId);
        },
        enabled: !!clientId,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}

export function useBhavaNavamsha(clientId: string) {
    return useQuery({
        queryKey: queryKeys.navamsha.bhava(clientId),
        queryFn: async () => {
            if (!clientId) throw new Error("Client ID required");
            return await clientApi.getBhavaNavamsha(clientId);
        },
        enabled: !!clientId,
        staleTime: 1000 * 60 * 60,
    });
}

export function useDivajiyaNavamsha(clientId: string) {
    return useQuery({
        queryKey: queryKeys.navamsha.divajiya(clientId),
        queryFn: async () => {
            if (!clientId) throw new Error("Client ID required");
            return await clientApi.getDivajiyaNavamsha(clientId);
        },
        enabled: !!clientId,
        staleTime: 1000 * 60 * 60,
    });
}

export function useKshetraNavamsha(clientId: string) {
    return useQuery({
        queryKey: queryKeys.navamsha.kshetra(clientId),
        queryFn: async () => {
            if (!clientId) throw new Error("Client ID required");
            return await clientApi.getKshetraNavamsha(clientId);
        },
        enabled: !!clientId,
        staleTime: 1000 * 60 * 60,
    });
}

export function useTajikaNavamsha(clientId: string) {
    return useQuery({
        queryKey: queryKeys.navamsha.tajika(clientId),
        queryFn: async () => {
            if (!clientId) throw new Error("Client ID required");
            return await clientApi.getTajikaNavamsha(clientId);
        },
        enabled: !!clientId,
        staleTime: 1000 * 60 * 60,
    });
}

export function useTulyaNavamsha(clientId: string) {
    return useQuery({
        queryKey: queryKeys.navamsha.tulya(clientId),
        queryFn: async () => {
            if (!clientId) throw new Error("Client ID required");
            return await clientApi.getTulyaNavamsha(clientId);
        },
        enabled: !!clientId,
        staleTime: 1000 * 60 * 60,
    });
}

export function useVargottamaNavamsha(clientId: string) {
    return useQuery({
        queryKey: queryKeys.navamsha.vargottama(clientId),
        queryFn: async () => {
            if (!clientId) throw new Error("Client ID required");
            return await clientApi.getVargottamaNavamsha(clientId);
        },
        enabled: !!clientId,
        staleTime: 1000 * 60 * 60,
    });
}

export function useKarmasthanaNavamsha(clientId: string) {
    return useQuery({
        queryKey: queryKeys.navamsha.karmasthana(clientId),
        queryFn: async () => {
            if (!clientId) throw new Error("Client ID required");
            return await clientApi.getKarmasthanaNavamsha(clientId);
        },
        enabled: !!clientId,
        staleTime: 1000 * 60 * 60,
    });
}

export function useSukhabhamChart(clientId: string) {
    return useQuery({
        queryKey: queryKeys.navamsha.sukhabham(clientId),
        queryFn: async () => {
            if (!clientId) throw new Error("Client ID required");
            return await clientApi.getSukhabhamChart(clientId);
        },
        enabled: !!clientId,
        staleTime: 1000 * 60 * 60,
    });
}

export function useVainashikaNavamsha(clientId: string) {
    return useQuery({
        queryKey: queryKeys.navamsha.vainashika(clientId),
        queryFn: async () => {
            if (!clientId) throw new Error("Client ID required");
            return await clientApi.getVainashikaNavamsha(clientId);
        },
        enabled: !!clientId,
        staleTime: 1000 * 60 * 60,
    });
}

export function useKarmabhamChart(clientId: string) {
    return useQuery({
        queryKey: queryKeys.navamsha.karmabham(clientId),
        queryFn: async () => {
            if (!clientId) throw new Error("Client ID required");
            return await clientApi.getKarmabhamChart(clientId);
        },
        enabled: !!clientId,
        staleTime: 1000 * 60 * 60,
    });
}

export function useD55Navamsha(clientId: string) {
    return useQuery({
        queryKey: queryKeys.navamsha.d55(clientId),
        queryFn: async () => {
            if (!clientId) throw new Error("Client ID required");
            return await clientApi.getD55Navamsha(clientId);
        },
        enabled: !!clientId,
        staleTime: 1000 * 60 * 60,
    });
}

export function useD64KharaNavamsha(clientId: string) {
    return useQuery({
        queryKey: queryKeys.navamsha.d64Khara(clientId),
        queryFn: async () => {
            if (!clientId) throw new Error("Client ID required");
            return await clientApi.getD64KharaNavamsha(clientId);
        },
        enabled: !!clientId,
        staleTime: 1000 * 60 * 60,
    });
}

export function useD81Chart(clientId: string) {
    return useQuery({
        queryKey: queryKeys.navamsha.d81(clientId),
        queryFn: async () => {
            if (!clientId) throw new Error("Client ID required");
            return await clientApi.getD81Chart(clientId);
        },
        enabled: !!clientId,
        staleTime: 1000 * 60 * 60,
    });
}

export function useD88SynastryChart(clientId: string) {
    return useQuery({
        queryKey: queryKeys.navamsha.d88Synastry(clientId),
        queryFn: async () => {
            if (!clientId) throw new Error("Client ID required");
            return await clientApi.getD88SynastryChart(clientId);
        },
        enabled: !!clientId,
        staleTime: 1000 * 60 * 60,
    });
}

export function useD91LabhamChart(clientId: string) {
    return useQuery({
        queryKey: queryKeys.navamsha.d91Labham(clientId),
        queryFn: async () => {
            if (!clientId) throw new Error("Client ID required");
            return await clientApi.getD91LabhamChart(clientId);
        },
        enabled: !!clientId,
        staleTime: 1000 * 60 * 60,
    });
}

export function useAntyaChart(clientId: string) {
    return useQuery({
        queryKey: queryKeys.navamsha.antya(clientId),
        queryFn: async () => {
            if (!clientId) throw new Error("Client ID required");
            return await clientApi.getAntyaChart(clientId);
        },
        enabled: !!clientId,
        staleTime: 1000 * 60 * 60,
    });
}

export function useSystemCapabilities(system: string) {
    return useMemo(() => clientApi.getSystemCapabilities(system), [system]);
}
