import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { knowledgeApi } from "@/lib/api/knowledge";
import { STALE_TIMES } from "@/lib/api/stale-times";
import type { KnowledgeEntry } from "@/types/knowledge.types";

/**
 * Fetch a single knowledge entry by termKey.
 * Returns null (not error) for missing terms — graceful degradation.
 */
export function useKnowledgeTerm(termKey: string | undefined) {
    return useQuery<KnowledgeEntry | null>({
        queryKey: queryKeys.knowledge.term(termKey ?? ''),
        queryFn: async () => {
            if (!termKey) return null;
            try {
                const response = await knowledgeApi.getByTermKey(termKey);
                return response.data;
            } catch (err: unknown) {
                // 404 = term doesn't exist in knowledge base — return null, don't throw
                if (err instanceof Error && err.message.includes('404')) {
                    return null;
                }
                throw err;
            }
        },
        staleTime: STALE_TIMES.KNOWLEDGE,
        enabled: !!termKey,
        retry: 1,
    });
}

/**
 * Fetch multiple knowledge entries in a single batch request.
 * Returns a map of termKey → KnowledgeEntry for easy lookup.
 * Automatically deduplicates and caps at 50 keys.
 */
export function useKnowledgeBatch(keys: string[]) {
    const uniqueKeys = [...new Set(keys)].slice(0, 50);

    return useQuery<Record<string, KnowledgeEntry>>({
        queryKey: queryKeys.knowledge.batch(uniqueKeys),
        queryFn: async () => {
            if (uniqueKeys.length === 0) return {};
            const response = await knowledgeApi.getBatch(uniqueKeys);
            return response.data;
        },
        staleTime: STALE_TIMES.KNOWLEDGE,
        enabled: uniqueKeys.length > 0,
        retry: 1,
    });
}

/**
 * Search knowledge entries by query text.
 */
export function useKnowledgeSearch(q: string, domain?: string, limit?: number) {
    return useQuery({
        queryKey: queryKeys.knowledge.search(q, domain),
        queryFn: async () => {
            const response = await knowledgeApi.search(q, domain, limit);
            return response.data;
        },
        staleTime: STALE_TIMES.KNOWLEDGE,
        enabled: q.length >= 2,
        retry: 1,
    });
}
