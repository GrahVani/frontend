import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { PanchangDay, PlanetaryTransit, Festival, PersonalEvent } from "@/types/calendar.types";
import { queryKeys } from "@/lib/query-keys";
import { panchangApi } from "@/lib/api/panchang";
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

export function useFestivals(year: number) {
    return useQuery<Festival[]>({
        queryKey: queryKeys.calendar.festivals(year),
        queryFn: async () => {
            // Festival data requires a dedicated database or API.
            // The panchang calculation engine doesn't provide festival lists.
            // This will be wired when a festival data source is available.
            return [];
        },
        staleTime: 1000 * 60 * 60 * 24 * 7,
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
