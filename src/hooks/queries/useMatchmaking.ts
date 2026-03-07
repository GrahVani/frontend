import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { BirthDetails, MatchResult, SavedMatch } from "@/types/matchmaking.types";
import { queryKeys } from "@/lib/query-keys";
import { matchmakingApi } from "@/lib/api/matchmaking";
import { STALE_TIMES } from "@/lib/api/stale-times";

export function useMatchAnalysis() {
    const queryClient = useQueryClient();

    return useMutation<MatchResult, Error, { bride: BirthDetails; groom: BirthDetails }>({
        mutationFn: ({ bride, groom }) => matchmakingApi.analyze(bride, groom),
        onSuccess: () => {
            // Invalidate saved list so new analysis shows up if auto-saved
            queryClient.invalidateQueries({ queryKey: queryKeys.matchmaking.saved });
        },
    });
}

export function useSavedMatches() {
    return useQuery<SavedMatch[]>({
        queryKey: queryKeys.matchmaking.saved,
        queryFn: () => matchmakingApi.listSaved(),
        staleTime: STALE_TIMES.SAVED_MATCHES,
    });
}

export function useSavedMatch(id: string | null) {
    return useQuery<SavedMatch | null>({
        queryKey: queryKeys.matchmaking.detail(id || ''),
        queryFn: () => matchmakingApi.getSaved(id!),
        enabled: !!id,
        staleTime: STALE_TIMES.MATCHMAKING,
    });
}

export function useSaveMatch() {
    const queryClient = useQueryClient();

    return useMutation<SavedMatch, Error, { result: MatchResult; notes?: string }>({
        mutationFn: ({ result, notes }) => matchmakingApi.saveMatch(result, notes),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.matchmaking.saved });
        },
    });
}

export function useDeleteMatch() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, string>({
        mutationFn: (matchId) => matchmakingApi.deleteMatch(matchId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.matchmaking.saved });
        },
    });
}
