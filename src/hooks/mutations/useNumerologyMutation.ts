import { useMutation } from "@tanstack/react-query";
import { numerologyApi } from "@/lib/api/numerology";
import type { ChaldeanServiceResponse, ChaldeanRawResponse } from "@/types/numerology.types";

/**
 * Generic service mutation — covers all 76 Chaldean service endpoints.
 * Each endpoint is a POST that returns QuickScore + Summary + AI Narrative.
 */
export function useChaldeanService(category: string, slug: string) {
    return useMutation<ChaldeanServiceResponse, Error, Record<string, unknown>>({
        mutationFn: (data) => numerologyApi.service(category, slug, data),
    });
}

/**
 * Generic raw calculator mutation — covers all 92 raw calculators.
 * Returns pure mathematical calculation results (no AI narrative).
 */
export function useChaldeanRaw(slug: string) {
    return useMutation<ChaldeanRawResponse, Error, Record<string, unknown>>({
        mutationFn: (data) => numerologyApi.rawCalculate(slug, data),
    });
}
