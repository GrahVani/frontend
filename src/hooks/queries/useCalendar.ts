import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { PanchangDay, PlanetaryTransit, Festival, PersonalEvent } from "@/types/calendar.types";
import { queryKeys } from "@/lib/query-keys";
import { panchangApi } from "@/lib/api/panchang";
import { festivalApi } from "@/lib/api/festival";
import { STALE_TIMES } from "@/lib/api/stale-times";

function extractDayFields(data: Record<string, unknown>, dateStr: string): PanchangDay {
    const panchanga = (data.panchanga || data) as Record<string, unknown>;
    const times = (data.times || data) as Record<string, unknown>;

    const getName = (field: unknown): string => {
        if (!field) return '-';
        if (typeof field === 'string') return field;
        if (typeof field === 'object' && field !== null) {
            return String((field as Record<string, unknown>).name || '-');
        }
        return String(field);
    };

    const getTime = (field: unknown): string => {
        if (!field) return '-';
        if (typeof field === 'string') return field;
        if (typeof field === 'object' && field !== null) {
            return String((field as Record<string, unknown>).time || '-');
        }
        return String(field);
    };

    const dayOfWeek = new Date(dateStr + 'T12:00:00').toLocaleDateString('en', { weekday: 'long' });
    const yoga = getName(panchanga.yoga);

    return {
        date: dateStr,
        tithi: getName(panchanga.tithi),
        nakshatra: getName(panchanga.nakshatra),
        yoga,
        karana: getName(panchanga.karana),
        dayOfWeek,
        sunrise: getTime(times.sunrise),
        sunset: getTime(times.sunset),
        isAuspicious: ['Siddha', 'Amrita', 'Shubha'].some(y => yoga.includes(y)),
    };
}

export function useMonthlyCalendar(year: number, month: number) {
    return useQuery<PanchangDay[]>({
        queryKey: queryKeys.calendar.monthly(year, month),
        queryFn: async () => {
            const daysInMonth = new Date(year, month, 0).getDate();
            const results: PanchangDay[] = [];

            // Fetch each day's panchang — backend caches each request
            for (let day = 1; day <= daysInMonth; day++) {
                const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                try {
                    const response = await panchangApi.getPanchang({
                        birthDate: dateStr,
                        birthTime: '06:00:00',
                    });
                    if (response.success && response.data) {
                        results.push(extractDayFields(response.data, dateStr));
                    }
                } catch {
                    // Skip failed days
                }
            }

            return results;
        },
        staleTime: STALE_TIMES.CALENDAR,
        enabled: false, // Manual trigger — too many sequential API calls
    });
}

export function usePlanetaryTransits(year: number, month: number) {
    return useQuery<PlanetaryTransit[]>({
        queryKey: queryKeys.calendar.transits(year, month),
        queryFn: async () => {
            // Planetary transits require a different backend endpoint
            // that tracks planet sign changes over a date range.
            // This is not yet available in the astro-engine panchanga routes.
            return [];
        },
        staleTime: STALE_TIMES.CALENDAR,
    });
}

export type FestivalFilterType = 'ALL' | 'MAJOR' | 'EKADASHI' | 'SANKRANTI' | 'HOLIDAY' | 'REGIONAL' | string;

export function useFestivals(year: number, filter: FestivalFilterType = 'ALL', region?: string) {
    return useQuery<Festival[]>({
        queryKey: [...queryKeys.calendar.festivals(year), filter, region],
        queryFn: async () => {
            try {
                let res;
                const isRecurringCategory = ['PRADOSH', 'RECURRING', 'AMAVASYA', 'PURNIMA'].includes(filter);

                switch (filter) {
                    case 'MAJOR':
                        res = await festivalApi.getMajorFestivals({ year }); break;
                    case 'EKADASHI':
                        res = await festivalApi.getEkadashis({ year }); break;
                    case 'SANKRANTI':
                        res = await festivalApi.getSankrantis({ year }); break;
                    case 'HOLIDAY':
                        res = await festivalApi.getHolidays({ year }); break;
                    case 'REGIONAL':
                        res = await festivalApi.getRegionalFestivals({ year, region: region || 'DL' }); break;
                    case 'ALL':
                        res = await festivalApi.getCalendar({ year }); break;
                    default:
                        // For dynamic categories like "PRADOSH" or "VRAT"
                        res = await festivalApi.getCalendar({ 
                            year, 
                            categories: [filter],
                            include_recurring: isRecurringCategory
                        }); break;
                }
                
                // Extract festivals or holidays array from response
                let data: Festival[] = [];
                if (res.success && res.data) {
                    if (res.data.festivals) data = res.data.festivals;
                    else if (res.data.holidays) data = res.data.holidays;
                    else if (Array.isArray(res.data)) data = res.data;
                }

                // If we used a standard endpoint that doesn't support category filtering (like regional/holidays), 
                // or if it was the 'ALL' case, we might need a local fallback.
                // But for default (dynamic categories), we already filtered at the API level.
                const standardFilters = ['ALL', 'MAJOR', 'EKADASHI', 'SANKRANTI', 'HOLIDAY', 'REGIONAL'];
                if (filter && standardFilters.includes(filter)) {
                    return data;
                }
                
                // For dynamic categories, the API already filtered, but we do a safe check
                return data.filter(f => f.category === filter || !filter || filter === 'ALL');
            } catch (error) {
                console.error(`Failed to fetch festivals (${filter}):`, error);
                return [];
            }
        },
        staleTime: 5 * 60 * 1000, // 5 minutes cache
    });
}

export function useFestivalsByMonth(year: number, month: number) {
    return useQuery<Festival[]>({
        queryKey: [...queryKeys.calendar.festivals(year), 'MONTH', month],
        queryFn: async () => {
            try {
                const res = await festivalApi.getFestivalsByMonth({ year, month });
                if (res.success && res.data) {
                    if (res.data.festivals) return res.data.festivals;
                    if (Array.isArray(res.data)) return res.data;
                }
                return [];
            } catch (error) {
                console.error(`Failed to fetch festivals for ${year}-${month}:`, error);
                return [];
            }
        },
        staleTime: 5 * 60 * 1000,
        enabled: !!year && !!month,
    });
}

export function usePersonalEvents(year: number, month: number) {
    return useQuery<PersonalEvent[]>({
        queryKey: queryKeys.calendar.personal(year, month),
        queryFn: async () => {
            // Personal events require a backend CRUD service.
            // Not yet available in the Grahvani microservices.
            return [];
        },
        staleTime: 1000 * 60 * 2,
    });
}

export function useUpcomingFestivals(dateStr: string, limit: number = 10) {
    return useQuery<Festival[]>({
        queryKey: [...queryKeys.calendar.festivals(new Date(dateStr).getFullYear()), 'UPCOMING', dateStr, limit],
        queryFn: async () => {
            if (!dateStr) return [];
            try {
                const res = await festivalApi.getUpcomingFestivals({ date: dateStr, limit });
                if (res.success && res.data) {
                    if (res.data.festivals) return res.data.festivals;
                    if (Array.isArray(res.data)) return res.data;
                }
                return [];
            } catch (error) {
                console.error("Failed to fetch upcoming festivals:", error);
                return [];
            }
        },
        staleTime: 5 * 60 * 1000,
        enabled: !!dateStr,
    });
}


export function useLunarMonths(year: number) {
    return useQuery<any>({
        queryKey: [...queryKeys.calendar.festivals(year), 'LUNAR_MONTHS'],
        queryFn: async () => {
            try {
                const res = await festivalApi.getLunarMonths({ year });
                return res.success && res.data ? res.data : null;
            } catch (error) {
                console.error("Failed to fetch lunar months:", error);
                return null;
            }
        },
        staleTime: 60 * 60 * 1000, // 1 hour
    });
}

export function useFestivalCategories() {
    return useQuery<string[]>({
        queryKey: [...queryKeys.calendar.festivals(2026), 'CATEGORIES'],
        queryFn: async () => {
            try {
                const res = await festivalApi.getCategories();
                if (res.success && res.data && res.data.categories) {
                    return res.data.categories.map((c: any) => c.id);
                }
                return [];
            } catch (error) {
                return [];
            }
        },
    });
}

export function useCreateEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (event: Omit<PersonalEvent, "id">) => {
            // Will call backend events API when available
            return { ...event, id: crypto.randomUUID() } as PersonalEvent;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.calendar.personalAll });
        },
    });
}

export function useDeleteEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (eventId: string) => {
            // Will call backend events API when available
            return eventId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.calendar.personalAll });
        },
    });
}
