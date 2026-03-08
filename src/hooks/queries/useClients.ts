import { useQuery } from "@tanstack/react-query";
import { clientApi } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

export interface ClientQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    gender?: string;
    city?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    myClientsOnly?: boolean;
}

export function useClients(params: ClientQueryParams = {}) {
    return useQuery({
        queryKey: queryKeys.clients.list(params),
        queryFn: async () => {
            return await clientApi.getClients(params);
        },
        placeholderData: (previousData) => previousData,
        staleTime: 1000 * 60,
    });
}

export function useClient(id?: string) {
    return useQuery({
        queryKey: queryKeys.clients.detail(id ?? ''),
        queryFn: async () => {
            if (!id) throw new Error("Client ID is required");
            return await clientApi.getClient(id);
        },
        enabled: !!id,
        staleTime: 1000 * 60, // 1 minute
    });
}
