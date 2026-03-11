import { useMemo } from "react";
import { getStaticKnowledgeEntry, getStaticKnowledgeBatch } from "@/lib/knowledge-static-data";

// Re-export the static entry type for consumers
type StaticEntry = NonNullable<ReturnType<typeof getStaticKnowledgeEntry>>;

/**
 * Get a single knowledge entry by termKey.
 * Reads from the embedded static data (217 entries) — no API call needed.
 * Returns { data, isLoading: false } to match the previous useQuery interface.
 */
export function useKnowledgeTerm(termKey: string | undefined) {
    const data = useMemo(() => {
        if (!termKey) return null;
        return getStaticKnowledgeEntry(termKey) ?? null;
    }, [termKey]);

    return { data, isLoading: false, isError: false, error: null };
}

/**
 * Get multiple knowledge entries by termKeys.
 * Returns a map of termKey → entry from embedded static data.
 */
export function useKnowledgeBatch(keys: string[]) {
    const data = useMemo(() => {
        if (keys.length === 0) return {} as Record<string, StaticEntry>;
        return getStaticKnowledgeBatch(keys);
    }, [keys]);

    return { data, isLoading: false, isError: false, error: null };
}

/**
 * Search knowledge entries by query text.
 * Simple client-side filter over static data.
 */
export function useKnowledgeSearch(q: string, _domain?: string, limit?: number) {
    const data = useMemo(() => {
        if (q.length < 2) return [];
        const lowerQ = q.toLowerCase();
        const { KNOWLEDGE_MAP } = require("@/lib/knowledge-static-data");
        const results: StaticEntry[] = [];
        for (const entry of KNOWLEDGE_MAP.values()) {
            if (
                entry.title.toLowerCase().includes(lowerQ) ||
                entry.summary.toLowerCase().includes(lowerQ) ||
                entry.termKey.toLowerCase().includes(lowerQ) ||
                entry.tags?.some((t: string) => t.toLowerCase().includes(lowerQ))
            ) {
                results.push(entry);
                if (limit && results.length >= limit) break;
            }
        }
        return results;
    }, [q, _domain, limit]);

    return { data, isLoading: false, isError: false, error: null };
}
