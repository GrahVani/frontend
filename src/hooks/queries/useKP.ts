import { useQuery, useMutation, UseQueryOptions } from '@tanstack/react-query';
import { kpApi } from '@/lib/api';
import type {
    KpPlanetsCuspsResponse,
    KpRulingPlanetsResponse,
    KpBhavaDetailsResponse,
    KpSignificationsResponse,
    KpHoraryResponse,
} from '@/types/kp.types';
import { queryKeys } from '@/lib/query-keys';

/**
 * Hook for fetching KP Planets and Cusps with sub-lords
 * Core chart data for KP system
 */
export function useKpPlanetsCusps(
    clientId: string,
    options?: Omit<UseQueryOptions<KpPlanetsCuspsResponse, Error>, 'queryKey' | 'queryFn'>
) {
    return useQuery<KpPlanetsCuspsResponse, Error>({
        queryKey: queryKeys.kp.planetsCusps(clientId),
        queryFn: () => kpApi.getPlanetsCusps(clientId),
        enabled: !!clientId,
        staleTime: 10 * 60 * 1000, // 10 minutes - chart data is stable
        retry: 1,
        ...options,
    });
}

/**
 * Hook for fetching current Ruling Planets
 * Time-sensitive data - shorter cache
 */
export function useKpRulingPlanets(
    clientId: string,
    options?: Omit<UseQueryOptions<KpRulingPlanetsResponse, Error>, 'queryKey' | 'queryFn'>
) {
    return useQuery<KpRulingPlanetsResponse, Error>({
        queryKey: queryKeys.kp.rulingPlanets(clientId),
        queryFn: () => kpApi.getRulingPlanets(clientId),
        enabled: !!clientId,
        staleTime: 5 * 60 * 1000, // 5 minutes - time-sensitive
        refetchInterval: 5 * 60 * 1000, // Auto-refetch every 5 minutes
        retry: 1,
        ...options,
    });
}

/**
 * Hook for fetching Bhava (House) Details
 */
export function useKpBhavaDetails(
    clientId: string,
    options?: Omit<UseQueryOptions<KpBhavaDetailsResponse, Error>, 'queryKey' | 'queryFn'>
) {
    return useQuery<KpBhavaDetailsResponse, Error>({
        queryKey: queryKeys.kp.bhavaDetails(clientId),
        queryFn: () => kpApi.getBhavaDetails(clientId),
        enabled: !!clientId,
        staleTime: 10 * 60 * 1000,
        retry: 1,
        ...options,
    });
}

/**
 * Hook for fetching Significations
 * Which planets signify which houses (key for KP predictions)
 */
export function useKpSignifications(
    clientId: string,
    options?: Omit<UseQueryOptions<KpSignificationsResponse, Error>, 'queryKey' | 'queryFn'>
) {
    return useQuery<KpSignificationsResponse, Error>({
        queryKey: queryKeys.kp.significations(clientId),
        queryFn: () => kpApi.getSignifications(clientId),
        enabled: !!clientId,
        staleTime: 10 * 60 * 1000,
        retry: 1,
        ...options,
    });
}

/**
 * Hook for fetching House Significations (Table 1)
 */
export function useKpHouseSignifications(
    clientId: string,
    options?: Omit<UseQueryOptions<KpSignificationsResponse, Error>, 'queryKey' | 'queryFn'>
) {
    return useQuery<KpSignificationsResponse, Error>({
        queryKey: queryKeys.kp.houseSignifications(clientId),
        queryFn: () => kpApi.getHouseSignifications(clientId),
        enabled: !!clientId,
        staleTime: 10 * 60 * 1000,
        retry: 1,
        ...options,
    });
}

/**
 * Hook for fetching Planet Significators (Table 2 - Matrix)
 */
export function useKpPlanetSignificators(
    clientId: string,
    options?: Omit<UseQueryOptions<KpSignificationsResponse, Error>, 'queryKey' | 'queryFn'>
) {
    return useQuery<KpSignificationsResponse, Error>({
        queryKey: queryKeys.kp.planetSignificators(clientId),
        queryFn: () => kpApi.getPlanetSignificators(clientId),
        enabled: !!clientId,
        staleTime: 10 * 60 * 1000,
        retry: 1,
        ...options,
    });
}

/**
 * Hook for fetching KP Cuspal Interlinks
 */
export function useKpInterlinks(
    clientId: string,
    options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>
) {
    return useQuery<any, Error>({
        queryKey: queryKeys.kp.interlinks(clientId),
        queryFn: () => kpApi.getInterlinks(clientId),
        enabled: !!clientId,
        staleTime: 10 * 60 * 1000,
        ...options,
    });
}

/**
 * Hook for fetching KP Advanced Interlinks (SSL)
 */
export function useKpAdvancedInterlinks(
    clientId: string,
    options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>
) {
    return useQuery<any, Error>({
        queryKey: queryKeys.kp.advancedInterlinks(clientId),
        queryFn: () => kpApi.getAdvancedInterlinks(clientId),
        enabled: !!clientId,
        staleTime: 10 * 60 * 1000,
        ...options,
    });
}

/**
 * Hook for fetching KP Nakshatra Nadi
 */
export function useKpNakshatraNadi(
    clientId: string,
    options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>
) {
    return useQuery<any, Error>({
        queryKey: queryKeys.kp.nakshatraNadi(clientId),
        queryFn: () => kpApi.getNakshatraNadi(clientId),
        enabled: !!clientId,
        staleTime: 10 * 60 * 1000,
        ...options,
    });
}

/**
 * Hook for fetching KP Pars Fortuna
 */
export function useKpFortuna(
    clientId: string,
    options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>
) {
    return useQuery<any, Error>({
        queryKey: queryKeys.kp.fortuna(clientId),
        queryFn: () => kpApi.getFortuna(clientId),
        enabled: !!clientId,
        staleTime: 10 * 60 * 1000,
        ...options,
    });
}

/**
 * Mutation hook for KP Horary (Prashna)
 * Used as mutation since it requires user input each time
 */
export function useKpHoraryMutation() {
    return useMutation<KpHoraryResponse, Error, { clientId: string; horaryNumber: number; question: string }>({
        mutationFn: ({ clientId, horaryNumber, question }) =>
            kpApi.getHorary(clientId, horaryNumber, question),
    });
}
