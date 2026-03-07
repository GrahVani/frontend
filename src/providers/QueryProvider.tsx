"use client";

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { ApiError } from "@/lib/api/core";
import { mapApiError } from "@/lib/api/error-codes";
import { STALE_TIMES } from "@/lib/api/stale-times";
import { captureException } from "@/lib/monitoring";

export default function QueryProvider({ children }: { children: ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                queryCache: new QueryCache({
                    onError: (error, query) => {
                        // Global query error handler (API-011)
                        const mapped = mapApiError(error);
                        const queryKey = Array.isArray(query.queryKey) ? query.queryKey[0] : query.queryKey;

                        // Skip logging 401s — handled by auth refresh
                        if (error instanceof ApiError && error.status === 401) return;
                        if (error.message?.includes("Session expired")) return;

                        captureException(error, {
                            level: 'error',
                            tags: { source: 'query-cache', queryKey: String(queryKey) },
                            extra: { title: mapped.title, message: mapped.message },
                        });
                    },
                }),
                mutationCache: new MutationCache({
                    onError: (error, _variables, _context, mutation) => {
                        const mapped = mapApiError(error);
                        const mutationKey = mutation.options.mutationKey
                            ? String(mutation.options.mutationKey[0])
                            : 'unknown';

                        captureException(error, {
                            level: 'error',
                            tags: { source: 'mutation-cache', mutationKey },
                            extra: { title: mapped.title, message: mapped.message },
                        });
                    },
                }),
                defaultOptions: {
                    queries: {
                        staleTime: STALE_TIMES.CHART, // Default to chart stale time; override per-query
                        retry: (failureCount, error) => {
                            // Don't retry auth, forbidden, not-found, or validation errors
                            if (error instanceof ApiError) {
                                const noRetry = [401, 403, 404, 422].includes(error.status);
                                return !noRetry && failureCount < 3;
                            }
                            // Fallback: check message for session expiry
                            const msg = error instanceof Error ? error.message : '';
                            if (msg.includes('Session expired')) return false;
                            return failureCount < 3;
                        },
                        retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
                        refetchOnWindowFocus: false,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
