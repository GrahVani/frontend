// Grantha Report Engine — Mutation hooks
// Handles report generation and cancellation with cache invalidation

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { granthaApi } from '@/lib/api/grantha';
import type { GenerateReportInput } from '@/types/grantha';

export function useGranthaMutations() {
    const queryClient = useQueryClient();

    const generateReport = useMutation({
        mutationFn: (input: GenerateReportInput) => granthaApi.generateReport(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.grantha.reports.all });
        },
    });

    const cancelReport = useMutation({
        mutationFn: (id: string) => granthaApi.cancelReport(id),
        onSuccess: (_data, id) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.grantha.reports.detail(id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.grantha.reports.all });
        },
    });

    return { generateReport, cancelReport };
}
