"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { useClientCharts, type ChartLookup } from "@/hooks/queries/useClientCharts";
import { useGenerateProfile } from "@/hooks/mutations/useGenerateProfile";

/** Pages that consume chart data — only fetch charts when on these routes */
const CHART_ROUTES = ['/vedic-astrology/customize', '/vedic-astrology', '/client/', '/comparison', '/matchmaking'];
const CHART_CACHE_KEY = 'vedic_charts_cache';
const OPEN_CLIENTS_KEY = 'vedic_open_clients';
const MAX_OPEN_CLIENTS = 8;

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
    // Multi-client tab management
    openClients: VedicClientDetails[];
    addOpenClient: (details: VedicClientDetails) => void;
    removeOpenClient: (clientId: string) => void;
    switchToClient: (clientId: string) => void;
}

const VedicClientContext = createContext<VedicClientContextType | undefined>(undefined);

/** Validate a client object has the minimum required shape */
function isValidClientDetails(obj: unknown): obj is VedicClientDetails {
    return (
        !!obj &&
        typeof obj === 'object' &&
        typeof (obj as VedicClientDetails).name === 'string' &&
        typeof (obj as VedicClientDetails).dateOfBirth === 'string' &&
        typeof (obj as VedicClientDetails).timeOfBirth === 'string' &&
        !!(obj as VedicClientDetails).placeOfBirth &&
        typeof (obj as VedicClientDetails).placeOfBirth.city === 'string'
    );
}

export function VedicClientProvider({ children }: { children: ReactNode }) {
    const [clientDetails, setClientDetails] = useState<VedicClientDetails | null>(null);
    const [openClients, setOpenClients] = useState<VedicClientDetails[]>([]);
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

    // ── Persist openClients to sessionStorage ──
    const persistOpenClients = useCallback((clients: VedicClientDetails[]) => {
        try {
            sessionStorage.setItem(OPEN_CLIENTS_KEY, JSON.stringify(clients));
        } catch {
            // sessionStorage quota exceeded — silently ignore
        }
    }, []);

    // ── Rehydrate from sessionStorage with validation (ST-003) ──
    useEffect(() => {
        // Rehydrate active client
        const stored = sessionStorage.getItem("vedic_client_temp");
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (isValidClientDetails(parsed)) {
                    setClientDetails(parsed as VedicClientDetails);
                } else {
                    sessionStorage.removeItem("vedic_client_temp");
                }
            } catch {
                sessionStorage.removeItem("vedic_client_temp");
            }
        }

        // Rehydrate open clients list
        const storedOpen = sessionStorage.getItem(OPEN_CLIENTS_KEY);
        if (storedOpen) {
            try {
                const parsed = JSON.parse(storedOpen);
                if (Array.isArray(parsed)) {
                    const valid = parsed.filter(isValidClientDetails) as VedicClientDetails[];
                    setOpenClients(valid.slice(0, MAX_OPEN_CLIENTS));
                } else {
                    sessionStorage.removeItem(OPEN_CLIENTS_KEY);
                }
            } catch {
                sessionStorage.removeItem(OPEN_CLIENTS_KEY);
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
    // Excludes large dasha payloads to avoid QuotaExceededError
    useEffect(() => {
        if (clientDetails?.id && Object.keys(processedCharts).length > 0) {
            try {
                // Strip large dasha data before caching — keep metadata only
                const cacheable: ChartLookup = {};
                for (const [key, chart] of Object.entries(processedCharts)) {
                    if (key.startsWith('dasha_') || key.startsWith('dasha-')) {
                        // Store dasha entries with truncated data (keep only first 2 items)
                        const chartData = chart?.chartData;
                        const truncatedData = Array.isArray(chartData)
                            ? chartData.slice(0, 2)
                            : typeof chartData === 'object' && chartData !== null
                                ? { ...chartData, periods: Array.isArray((chartData as any).periods) ? (chartData as any).periods.slice(0, 2) : (chartData as any).periods }
                                : chartData;
                        cacheable[key] = {
                            ...chart,
                            chartData: truncatedData,
                            _truncated: true,
                        } as any;
                    } else {
                        cacheable[key] = chart;
                    }
                }
                sessionStorage.setItem(`${CHART_CACHE_KEY}_${clientDetails.id}`, JSON.stringify(cacheable));
            } catch (e) {
                // Quota exceeded — clear cache and continue without caching
                console.warn("[VedicClientContext] sessionStorage quota exceeded, skipping chart cache");
                try {
                    sessionStorage.removeItem(`${CHART_CACHE_KEY}_${clientDetails.id}`);
                } catch {}
            }
        }
    }, [processedCharts, clientDetails?.id]);

    // ── Add a client to open tabs (and set as active) ──
    const addOpenClient = useCallback((details: VedicClientDetails) => {
        setOpenClients(prev => {
            // Remove existing entry for this client (by id or name fallback)
            const key = details.id || details.name;
            const filtered = prev.filter(c => (c.id || c.name) !== key);
            // Add to front, cap at MAX
            const updated = [details, ...filtered].slice(0, MAX_OPEN_CLIENTS);
            persistOpenClients(updated);
            return updated;
        });
    }, [persistOpenClients]);

    // ── Remove a client tab ──
    const removeOpenClient = useCallback((clientId: string) => {
        setOpenClients(prev => {
            const updated = prev.filter(c => (c.id || c.name) !== clientId);
            persistOpenClients(updated);

            // If we removed the active client, switch to the next one (or clear)
            const activeKey = clientDetails?.id || clientDetails?.name;
            if (activeKey === clientId) {
                if (updated.length > 0) {
                    setClientDetails(updated[0]);
                    sessionStorage.setItem("vedic_client_temp", JSON.stringify(updated[0]));
                } else {
                    setClientDetails(null);
                    sessionStorage.removeItem("vedic_client_temp");
                }
            }

            return updated;
        });
    }, [clientDetails, persistOpenClients]);

    // ── Switch to a client from the tab bar ──
    const switchToClient = useCallback((clientId: string) => {
        setOpenClients(prev => {
            const target = prev.find(c => (c.id || c.name) === clientId);
            if (target) {
                setClientDetails(target);
                sessionStorage.setItem("vedic_client_temp", JSON.stringify(target));
                // Reset auto-gen ref so charts are regenerated if needed
                hasAttemptedAutoGenRef.current = false;
            }
            return prev;
        });
    }, []);

    // ── Core update: also adds to open clients ──
    const updateClientDetails = useCallback((details: VedicClientDetails | null) => {
        setClientDetails(details);
        if (details) {
            sessionStorage.setItem("vedic_client_temp", JSON.stringify(details));
            // Also add to open clients tab bar
            addOpenClient(details);
        } else {
            sessionStorage.removeItem("vedic_client_temp");
        }
    }, [addOpenClient]);

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
        // Multi-client tab management
        openClients,
        addOpenClient,
        removeOpenClient,
        switchToClient,
    }), [clientDetails, isGeneratingCharts, effectiveCharts, isLoadingCharts, isRefreshingCharts, handleRefreshCharts, isInitialized, clearClientDetails, openClients, addOpenClient, removeOpenClient, switchToClient]);

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
