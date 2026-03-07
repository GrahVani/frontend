import { useQuery } from "@tanstack/react-query";
import type { MuhurtaCategory, MuhurtaResult, DailyMuhurta, MuhurtaFiltersState } from "@/types/muhurta.types";
import { queryKeys } from "@/lib/query-keys";
import { fetchDailyMuhurta, searchCategoryMuhurta } from "@/lib/api/muhurta";
import { STALE_TIMES } from "@/lib/api/stale-times";

function getTodayDateStr(): string {
    return new Date().toISOString().slice(0, 10);
}

export function useTodayMuhurta() {
    const today = getTodayDateStr();

    return useQuery<DailyMuhurta>({
        queryKey: queryKeys.muhurta.daily(today),
        queryFn: () => fetchDailyMuhurta(today),
        staleTime: STALE_TIMES.CALENDAR,
        retry: 2,
    });
}

export function useMuhurtaSearch(filters: MuhurtaFiltersState | null) {
    return useQuery<MuhurtaResult[]>({
        queryKey: queryKeys.muhurta.search(filters),
        queryFn: () => searchCategoryMuhurta(filters!),
        enabled: !!filters,
        staleTime: STALE_TIMES.CALENDAR,
    });
}

export function useCategoryMuhurta(category: MuhurtaCategory, startDate?: string, endDate?: string) {
    return useQuery<MuhurtaResult[]>({
        queryKey: queryKeys.muhurta.category(category, startDate, endDate),
        queryFn: () => searchCategoryMuhurta({
            category,
            startDate: startDate!,
            endDate: endDate!,
            location: '',
        }),
        enabled: !!startDate && !!endDate,
        staleTime: STALE_TIMES.CALENDAR,
    });
}
