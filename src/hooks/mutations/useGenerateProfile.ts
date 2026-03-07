import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientApi } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

export function useGenerateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (clientId: string) => clientApi.generateFullVedicProfile(clientId),
        onSuccess: (_, clientId) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.charts.byClient(clientId) });
        },
    });
}
