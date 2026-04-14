"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { useClientCharts, type ChartLookup } from "@/hooks/queries/useClientCharts";
import { useGenerateProfile } from "@/hooks/mutations/useGenerateProfile";

/** Pages that consume chart data — only fetch charts when on these routes */
const CHART_ROUTES = ['/vedic-astrology/customize', '/vedic-astrology', '/client/', '/comparison', '/matchmaking'];
const CHART_CACHE_KEY = 'vedic_charts_cache';

export interface VedicClientDetails {
    id?: string;
    name: string;
    gender: "male" | "female" | "other";
    dateOfBirth: string; // YYYY-MM-DD
    timeOfBirth: string; // HH:mm
    placeOfBirth: {
        city: string;
        latitude?: number;
        longitude?: number;
    };
    rashi?: string;
    fatherName?: string;
    motherName?: string;
    occupation?: string;
    notes?: string;
}

interface VedicClientContextType {
    clientDetails: VedicClientDetails | null;
    setClientDetails: (details: VedicClientDetails | null) => void;
    clearClientDetails: () => void;
    isClientSet: boolean;
    isGeneratingCharts: boolean;
    processedCharts: ChartLookup;
    isLoadingCharts: boolean; // True only if NO charts exist yet
    isRefreshingCharts: boolean; // True whenever a fetch is in progress
    refreshCharts: () => Promise<void>;
    isInitialized: boolean;
}

const VedicClientContext = createContext<VedicClientContextType | undefined>(undefined);

export function VedicClientProvider({ children }: { children: ReactNode }) {
    const [clientDetails, setClientDetails] = useState<VedicClientDetails | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [cachedCharts, setCachedCharts] = useState<ChartLookup>({});
    const pathname = usePathname();

    // Only fetch charts when on pages that actually need them (avoids 401 on dashboard/settings)
    const needsCharts = CHART_ROUTES.some(route => pathname?.startsWith(route));
    const chartClientId = needsCharts ? clientDetails?.id : undefined;

    const {
        data: processedCharts = {},
        isLoading: isQueryLoading,
        isRefetching: isRefreshingCharts,
        refetch: refreshCharts
    } = useClientCharts(chartClientId);

    const generateMutation = useGenerateProfile();
    const isGeneratingCharts = generateMutation.isPending;

    // Merge cached charts with query charts (query charts take precedence)
    const effectiveCharts = useMemo(() => {
        return { ...cachedCharts, ...processedCharts };
    }, [cachedCharts, processedCharts]);

    // isLoadingCharts should be true only if we have NO data (live or cached) AND we are loading
    const isLoadingCharts = isQueryLoading && Object.keys(effectiveCharts).length === 0;

    // Auto-generate charts on first visit if no charts exist (Option 2)
    const hasAttemptedAutoGenRef = useRef(false);
    useEffect(() => {
        // Only run when:
        // 1. Charts have finished loading (isQueryLoading is false)
        // 2. We haven't already attempted auto-generation
        // 3. Client ID exists
        // 4. Charts are empty
        // 5. Not already generating
        if (
            !isQueryLoading &&
            !hasAttemptedAutoGenRef.current &&
            chartClientId &&
            Object.keys(processedCharts).length === 0 &&
            !isGeneratingCharts
        ) {
            hasAttemptedAutoGenRef.current = true;
            generateMutation.mutate(chartClientId);
        }
    }, [isQueryLoading, chartClientId, processedCharts, isGeneratingCharts, generateMutation]);

    // Rehydrate from sessionStorage with validation (ST-003)
    useEffect(() => {
        const stored = sessionStorage.getItem("vedic_client_temp");
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Validate required shape before trusting sessionStorage data
                if (
                    parsed &&
                    typeof parsed === 'object' &&
                    typeof parsed.name === 'string' &&
                    typeof parsed.dateOfBirth === 'string' &&
                    typeof parsed.timeOfBirth === 'string' &&
                    parsed.placeOfBirth &&
                    typeof parsed.placeOfBirth.city === 'string'
                ) {
                    setClientDetails(parsed as VedicClientDetails);
                } else {
                    // Invalid shape — clear corrupted data
                    sessionStorage.removeItem("vedic_client_temp");
                }
            } catch {
                // Corrupted JSON — clear it
                sessionStorage.removeItem("vedic_client_temp");
            }
        }
        setIsInitialized(true);
    }, []);

    // Rehydrate Chart Cache (ST-004)
    useEffect(() => {
        if (!clientDetails?.id) return;
        const stored = sessionStorage.getItem(`${CHART_CACHE_KEY}_${clientDetails.id}`);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (parsed && typeof parsed === 'object') {
                    setCachedCharts(parsed);
                }
            } catch (e) {
                console.error("Failed to parse chart cache", e);
            }
        } else {
            setCachedCharts({});
        }
    }, [clientDetails?.id]);

    // Persist Charts to Cache when fetched (ST-005)
    useEffect(() => {
        if (clientDetails?.id && Object.keys(processedCharts).length > 0) {
            sessionStorage.setItem(`${CHART_CACHE_KEY}_${clientDetails.id}`, JSON.stringify(processedCharts));
        }
    }, [processedCharts, clientDetails?.id]);

    const updateClientDetails = useCallback((details: VedicClientDetails | null) => {
        setClientDetails(details);
        if (details) {
            sessionStorage.setItem("vedic_client_temp", JSON.stringify(details));
        } else {
            sessionStorage.removeItem("vedic_client_temp");
        }
    }, []);

    const clearClientDetails = useCallback(() => updateClientDetails(null), [updateClientDetails]);

    const handleRefreshCharts = useCallback(async () => {
        await refreshCharts();
    }, [refreshCharts]);

    // Memoize context value to prevent unnecessary consumer re-renders
    const value = useMemo<VedicClientContextType>(() => ({
        clientDetails,
        setClientDetails: updateClientDetails,
        clearClientDetails,
        isClientSet: !!clientDetails,
        isGeneratingCharts,
        processedCharts: effectiveCharts,
        isLoadingCharts,
        isRefreshingCharts,
        refreshCharts: handleRefreshCharts,
        isInitialized,
    }), [clientDetails, isGeneratingCharts, effectiveCharts, isLoadingCharts, isRefreshingCharts, handleRefreshCharts, isInitialized, clearClientDetails]);

    return (
        <VedicClientContext.Provider value={value}>
            {children}
        </VedicClientContext.Provider>
    );
}

export function useVedicClient() {
    const context = useContext(VedicClientContext);
    if (context === undefined) {
        throw new Error("useVedicClient must be used within a VedicClientProvider");
    }
    return context;
}
