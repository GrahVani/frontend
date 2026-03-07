import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientApi } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

export function useChartMutations() {
    const queryClient = useQueryClient();

    const generateChartMutation = useMutation({
        mutationFn: ({ clientId, chartType, ayanamsa }: { clientId: string; chartType: string; ayanamsa: string }) =>
            clientApi.generateChart(clientId, chartType, ayanamsa),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.charts.byClient(variables.clientId) });
        },
    });

    const generateFullVedicProfileMutation = useMutation({
        mutationFn: (clientId: string) => clientApi.generateFullVedicProfile(clientId),
        onSuccess: (_, clientId) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.charts.byClient(clientId) });
        },
    });

    return {
        generateChart: generateChartMutation,
        generateFullVedicProfile: generateFullVedicProfileMutation,
        isGeneratingFull: generateFullVedicProfileMutation.isPending
    };
}
