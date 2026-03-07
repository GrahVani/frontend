import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientApi } from "@/lib/api";
import { CreateClientPayload } from "@/types/client";
import { queryKeys } from "@/lib/query-keys";

export function useClientMutations() {
    const queryClient = useQueryClient();

    const createClientMutation = useMutation({
        mutationFn: (data: CreateClientPayload) => clientApi.createClient(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
        },
    });

    const updateClientMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CreateClientPayload> }) =>
            clientApi.updateClient(id, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.clients.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.charts.byClient(variables.id) });
        },
    });

    const deleteClientMutation = useMutation({
        mutationFn: (id: string) => clientApi.deleteClient(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
        },
    });

    return {
        createClient: createClientMutation,
        updateClient: updateClientMutation,
        deleteClient: deleteClientMutation
    };
}
