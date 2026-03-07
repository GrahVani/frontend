import { useQuery } from "@tanstack/react-query";
import { clientApi } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

export function useLocationSuggestions(query: string) {
    return useQuery({
        queryKey: queryKeys.locations.suggestions(query),
        queryFn: async () => {
            if (!query || query.length < 3) return { suggestions: [] };
            return await clientApi.getSuggestions(query);
        },
        enabled: !!query && query.length >= 3,
        staleTime: 1000 * 60 * 60, // 1 hour (locations don't change often)
    });
}
