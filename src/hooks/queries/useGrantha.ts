// Grantha Report Engine — React Query hooks
// Fetches blueprints and report status from the Grantha API

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { granthaApi } from '@/lib/api/grantha';

/** Fetch all available report blueprints (cached 5 minutes) */
export function useBlueprints() {
    return useQuery({
        queryKey: queryKeys.grantha.blueprints.all,
        queryFn: () => granthaApi.getBlueprints(),
        staleTime: 1000 * 60 * 5,
        select: (res) => res.data,
    });
}

/** Fetch a single blueprint's full details */
export function useBlueprintDetail(id: string | undefined) {
    return useQuery({
        queryKey: queryKeys.grantha.blueprints.detail(id ?? ''),
        queryFn: () => granthaApi.getBlueprintById(id!),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });
}

/** Fetch cost/time estimate for a blueprint */
export function useBlueprintEstimate(id: string | undefined) {
    return useQuery({
        queryKey: queryKeys.grantha.blueprints.estimate(id ?? ''),
        queryFn: () => granthaApi.estimateReport(id!),
        enabled: !!id,
        staleTime: 1000 * 60 * 2,
    });
}

/** Poll report status (every 3s while in-progress, stops when terminal) */
export function useReportStatus(id: string | undefined) {
    return useQuery({
        queryKey: queryKeys.grantha.reports.detail(id ?? ''),
        queryFn: () => granthaApi.getReport(id!),
        enabled: !!id,
        throwOnError: false,
        retry: 2,
        refetchInterval: (query) => {
            const status = query.state.data?.status;
            if (!status) return 3000;
            const terminal = ['COMPLETE', 'FAILED', 'CANCELLED', 'EXPIRED'];
            return terminal.includes(status) ? false : 3000;
        },
    });
}

/** List all reports (with optional pagination/filtering) */
export function useReports(params?: { page?: number; pageSize?: number; status?: string }) {
    return useQuery({
        queryKey: queryKeys.grantha.reports.list(params),
        queryFn: () => granthaApi.getReports(params),
        staleTime: 1000 * 30,
    });
}
