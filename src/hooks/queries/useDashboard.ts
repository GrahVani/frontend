import { useQuery } from "@tanstack/react-query";
import { useClients } from "./useClients";
import { queryKeys } from "@/lib/query-keys";
import { clientApi } from "@/lib/api";
import { STALE_TIMES } from "@/lib/api/stale-times";

// Dashboard overview: recent clients for the widget
export function useRecentClients(limit = 5) {
    return useClients({ limit, page: 1 });
}

// Dashboard stats summary — uses real client count from API
export interface DashboardStats {
    totalClients: number;
    todaySessions: number;
    pendingFollowUps: number;
    chartsGenerated: number;
}

export function useDashboardStats() {
    return useQuery<DashboardStats>({
        queryKey: queryKeys.dashboard.stats,
        queryFn: async () => {
            try {
                const response = await clientApi.getClients({ limit: 1, page: 1 });
                return {
                    totalClients: response?.pagination?.total ?? 0,
                    todaySessions: 0,
                    pendingFollowUps: 0,
                    chartsGenerated: 0,
                };
            } catch {
                return {
                    totalClients: 0,
                    todaySessions: 0,
                    pendingFollowUps: 0,
                    chartsGenerated: 0,
                };
            }
        },
        staleTime: STALE_TIMES.CLIENT_LIST,
    });
}
