import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { BirthDetails, MatchResult, SavedMatch } from "@/types/matchmaking.types";

export function useMatchAnalysis(bride?: BirthDetails, groom?: BirthDetails) {
    return useQuery<MatchResult>({
        queryKey: ["matchmaking", "analysis", bride, groom],
        queryFn: async () => {
            // TODO: Replace with actual matchmaking API call
            throw new Error("Matchmaking API not yet connected");
        },
        enabled: false, // Only runs when explicitly triggered
    });
}

export function useSavedMatches() {
    return useQuery<SavedMatch[]>({
        queryKey: ["matchmaking", "saved"],
        queryFn: async () => {
            // TODO: Replace with actual saved matches API
            return [];
        },
        staleTime: 1000 * 60 * 2,
    });
}

export function useSaveMatch() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (result: MatchResult) => {
            // TODO: Replace with actual save API call
            return { id: crypto.randomUUID(), result, savedAt: new Date().toISOString() };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["matchmaking", "saved"] });
        },
    });
}

export function useDeleteMatch() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (matchId: string) => {
            // TODO: Replace with actual delete API
            return matchId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["matchmaking", "saved"] });
        },
    });
}
