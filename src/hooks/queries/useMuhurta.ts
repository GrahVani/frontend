// Muhurat Engine — React Query hooks for all 9 endpoints
// Uses the new muhuratApi (server-side pipeline) instead of client-side scoring

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { muhuratApi } from "@/lib/api/muhurta";
import { STALE_TIMES } from "@/lib/api/stale-times";
import type {
  FindMuhuratParams,
  EvaluateDateParams,
  CompatibilityParams,
  MuhuratPanchangParams,
  InauspiciousParams,
  TimeQualityParams,
  MuhuratFindResponse,
  MuhuratEvaluateResponse,
  CompatibilityData,
  EventTypesResponse,
  TraditionsResponse,
  MuhuratPanchangResponse,
  InauspiciousWindowsResponse,
  TimeQualityResponse,
  EventTypeInfo,
  TraditionInfo,
} from "@/types/muhurta.types";

// ─── Core Hooks ─────────────────────────────────────────

export function useFindMuhurats(params: FindMuhuratParams | null) {
  return useQuery<MuhuratFindResponse>({
    queryKey: queryKeys.muhurta.find(params),
    queryFn: () => muhuratApi.findMuhurats(params!),
    enabled: !!params,
    staleTime: STALE_TIMES.MUHURAT_SEARCH,
    retry: 1,
  });
}

export function useEvaluateDate(params: EvaluateDateParams | null) {
  return useQuery<MuhuratEvaluateResponse>({
    queryKey: queryKeys.muhurta.evaluate(params),
    queryFn: () => muhuratApi.evaluateDate(params!),
    enabled: !!params,
    staleTime: STALE_TIMES.MUHURAT_SEARCH,
    retry: 1,
  });
}

export function useCompatibility(params: CompatibilityParams | null) {
  return useQuery<CompatibilityData>({
    queryKey: queryKeys.muhurta.compatibility(params),
    queryFn: () => muhuratApi.checkCompatibility(params!),
    enabled: !!params,
    staleTime: STALE_TIMES.MUHURAT_COMPATIBILITY,
    retry: 1,
  });
}

// ─── Static Data Hooks (fetch once, cache long) ─────────

export function useEventTypes() {
  return useQuery<EventTypesResponse>({
    queryKey: queryKeys.muhurta.eventTypes,
    queryFn: () => muhuratApi.getEventTypes(),
    staleTime: STALE_TIMES.MUHURAT_STATIC,
    retry: 2,
  });
}

export function useTraditions() {
  return useQuery<TraditionsResponse>({
    queryKey: queryKeys.muhurta.traditions,
    queryFn: () => muhuratApi.getTraditions(),
    staleTime: STALE_TIMES.MUHURAT_STATIC,
    retry: 2,
  });
}

// ─── Utility Hooks ──────────────────────────────────────

export function useMuhuratPanchang(params: MuhuratPanchangParams | null) {
  return useQuery<MuhuratPanchangResponse>({
    queryKey: queryKeys.muhurta.panchang(params),
    queryFn: () => muhuratApi.getPanchang(params!),
    enabled: !!params,
    staleTime: STALE_TIMES.MUHURAT_SEARCH,
    retry: 1,
  });
}

export function useInauspiciousWindows(params: InauspiciousParams | null) {
  return useQuery<InauspiciousWindowsResponse>({
    queryKey: queryKeys.muhurta.inauspicious(params),
    queryFn: () => muhuratApi.getInauspiciousWindows(params!),
    enabled: !!params,
    staleTime: STALE_TIMES.MUHURAT_SEARCH,
    retry: 1,
  });
}

export function useTimeQuality(params: TimeQualityParams | null) {
  return useQuery<TimeQualityResponse>({
    queryKey: queryKeys.muhurta.timeQuality(params),
    queryFn: () => muhuratApi.getTimeQuality(params!),
    enabled: !!params,
    staleTime: STALE_TIMES.MUHURAT_TIME_QUALITY,
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
    retry: 1,
  });
}

export function useInterpretation(params: { muhurat_data: Record<string, unknown>; event_type: string; tradition?: string; language?: string } | null) {
  return useQuery<string>({
    queryKey: queryKeys.muhurta.interpret(params),
    queryFn: () => muhuratApi.getInterpretation(params as any),
    enabled: !!params,
    staleTime: STALE_TIMES.MUHURAT_SEARCH,
    retry: 1,
  });
}

// ─── Derived Hooks (convenience) ────────────────────────

export function useEventTypeMap() {
  const { data } = useEventTypes();
  if (!data) return {};
  return Object.fromEntries(data.event_types.map((et: EventTypeInfo) => [et.code, et]));
}

export function useTraditionMap() {
  const { data } = useTraditions();
  if (!data) return {};
  return Object.fromEntries(data.traditions.map((t: TraditionInfo) => [t.code, t]));
}

// ─── Today's Muhurta (auto-params) ──────────────────────

export function useTodayPanchang() {
  const today = new Date().toISOString().slice(0, 10);
  return useMuhuratPanchang({ date: today, time: "06:00" });
}

export function useTodayInauspicious(tradition?: string) {
  const today = new Date().toISOString().slice(0, 10);
  return useInauspiciousWindows({
    date: today,
    tradition: (tradition as any) || "NORTH_INDIAN",
  });
}

export function useCurrentTimeQuality(tradition?: string) {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  return useTimeQuality({
    date,
    time,
    tradition: (tradition as any) || "NORTH_INDIAN",
  });
}

// ─── Legacy Exports (backward compat for old pages) ─────

import { fetchDailyMuhurta, searchCategoryMuhurta } from "@/lib/api/muhurta";
import type { DailyMuhurta, MuhurtaCategory, MuhurtaResult as LegacyMuhurtaResult, MuhurtaFiltersState } from "@/types/muhurta.types";

export function useTodayMuhurta() {
  const today = new Date().toISOString().slice(0, 10);
  return useQuery<DailyMuhurta>({
    queryKey: queryKeys.muhurta.daily(today),
    queryFn: () => fetchDailyMuhurta(today),
    staleTime: STALE_TIMES.MUHURAT_SEARCH,
    retry: 2,
  });
}

export function useMuhurtaSearch(filters: MuhurtaFiltersState | null) {
  return useQuery<LegacyMuhurtaResult[]>({
    queryKey: queryKeys.muhurta.search(filters),
    queryFn: () => searchCategoryMuhurta(filters!),
    enabled: !!filters,
    staleTime: STALE_TIMES.MUHURAT_SEARCH,
  });
}

export function useCategoryMuhurta(category: MuhurtaCategory, startDate?: string, endDate?: string) {
  return useQuery<LegacyMuhurtaResult[]>({
    queryKey: queryKeys.muhurta.category(category, startDate, endDate),
    queryFn: () => searchCategoryMuhurta({
      category,
      startDate: startDate!,
      endDate: endDate!,
      location: "",
    }),
    enabled: !!startDate && !!endDate,
    staleTime: STALE_TIMES.MUHURAT_SEARCH,
  });
}
