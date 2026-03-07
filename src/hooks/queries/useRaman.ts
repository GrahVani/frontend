
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ramanApi } from '@/lib/api';
import { RamanNatalResponse, RamanApiResponse } from '@/types/raman';
import { queryKeys } from '@/lib/query-keys';

export function useRamanNatalChart(
    clientId: string,
    options?: Omit<UseQueryOptions<RamanApiResponse<RamanNatalResponse>, Error>, 'queryKey' | 'queryFn'>
) {
    return useQuery<RamanApiResponse<RamanNatalResponse>, Error>({
        queryKey: queryKeys.raman.natal(clientId),
        queryFn: () => ramanApi.getNatal(clientId),
        enabled: !!clientId,    // Only fetch if clientId is present
        staleTime: 5 * 60 * 1000, // 5 minutes cache
        retry: 1,
        ...options,
    });
}
