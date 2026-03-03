import { useQuery } from "@tanstack/react-query";
import { useClients } from "./useClients";

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
        queryKey: ["dashboard", "activity"],
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
        queryKey: ["dashboard", "notifications"],
        queryFn: async () => {
            // TODO: Replace with actual API call when notification endpoints are available
            return [];
        },
        staleTime: 1000 * 60, // 1 minute
    });
}

// Dashboard stats summary
export interface DashboardStats {
    totalClients: number;
    todaySessions: number;
    pendingFollowUps: number;
    chartsGenerated: number;
}

export function useDashboardStats() {
    return useQuery<DashboardStats>({
        queryKey: ["dashboard", "stats"],
        queryFn: async () => {
            // TODO: Replace with actual API aggregation
            return {
                totalClients: 0,
                todaySessions: 0,
                pendingFollowUps: 0,
                chartsGenerated: 0,
            };
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
