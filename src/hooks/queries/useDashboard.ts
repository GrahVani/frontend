import { useQuery } from "@tanstack/react-query";
import { useClients } from "./useClients";
import { queryKeys } from "@/lib/query-keys";
import { clientApi } from "@/lib/api";
import { STALE_TIMES } from "@/lib/api/stale-times";

// Dashboard overview: recent clients for the widget
export function useRecentClients(limit = 5) {
    return useClients({ limit, page: 1 });
}

// Dashboard activity feed — placeholder for future API integration
export interface DashboardActivity {
    id: string;
    type: "client_created" | "chart_generated" | "report_sent";
    title: string;
    description: string;
    timestamp: string;
}

export function useDashboardActivity() {
    return useQuery<DashboardActivity[]>({
        queryKey: queryKeys.dashboard.activity,
        queryFn: async () => {
            // TODO: Replace with actual API call when dashboard endpoints are available
            return [];
        },
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
}

// Dashboard notifications — placeholder for future API integration
export interface DashboardNotification {
    id: string;
    title: string;
    message: string;
    type: "info" | "success" | "warning";
    read: boolean;
    timestamp: string;
}

export function useDashboardNotifications() {
    return useQuery<DashboardNotification[]>({
        queryKey: queryKeys.dashboard.notifications,
        queryFn: async () => {
            // TODO: Replace with actual API call when notification endpoints are available
            return [];
        },
        staleTime: 1000 * 60, // 1 minute
    });
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
