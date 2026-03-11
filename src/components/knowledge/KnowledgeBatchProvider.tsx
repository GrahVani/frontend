"use client";

import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { useKnowledgeBatch } from "@/hooks/queries/useKnowledge";
import { getStaticKnowledgeEntry } from "@/lib/knowledge-static-data";

type StaticEntry = NonNullable<ReturnType<typeof getStaticKnowledgeEntry>>;

interface KnowledgeBatchContextValue {
    /** Register a termKey for batch fetching. Returns void. */
    register: (termKey: string) => void;
    /** Get a cached entry from the batch result. Returns undefined if not yet loaded. */
    getEntry: (termKey: string) => StaticEntry | undefined;
    /** Whether the batch query is currently loading */
    isLoading: boolean;
}

const KnowledgeBatchContext = createContext<KnowledgeBatchContextValue | null>(null);

/**
 * Wraps a section of the page to batch-fetch all KnowledgeTooltip terms
 * in a single API call instead of N individual requests.
 *
 * Usage:
 *   <KnowledgeBatchProvider>
 *     <KnowledgeTooltip term="tithi">Tithi</KnowledgeTooltip>
 *     <KnowledgeTooltip term="nakshatra">Nakshatra</KnowledgeTooltip>
 *   </KnowledgeBatchProvider>
 *
 * Without this provider, each tooltip fetches individually (still works, just less efficient).
 */
export function KnowledgeBatchProvider({ children }: { children: React.ReactNode }) {
    const [keys, setKeys] = useState<string[]>([]);
    const registeredRef = useRef(new Set<string>());

    const register = useCallback((termKey: string) => {
        if (!registeredRef.current.has(termKey)) {
            registeredRef.current.add(termKey);
            setKeys(prev => [...prev, termKey]);
        }
    }, []);

    const { data: batchData, isLoading } = useKnowledgeBatch(keys);

    const getEntry = useCallback(
        (termKey: string): StaticEntry | undefined => {
            return batchData?.[termKey];
        },
        [batchData]
    );

    return (
        <KnowledgeBatchContext.Provider value={{ register, getEntry, isLoading }}>
            {children}
        </KnowledgeBatchContext.Provider>
    );
}

/**
 * Hook to access the batch provider (if present).
 * Returns null if no provider wraps the component — tooltip falls back to individual fetch.
 */
export function useKnowledgeBatchContext() {
    return useContext(KnowledgeBatchContext);
}
