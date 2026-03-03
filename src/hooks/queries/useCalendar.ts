import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { PanchangDay, PlanetaryTransit, Festival, PersonalEvent } from "@/types/calendar.types";

export function useMonthlyCalendar(year: number, month: number) {
    return useQuery<PanchangDay[]>({
        queryKey: ["calendar", "monthly", year, month],
        queryFn: async () => {
            // TODO: Replace with actual panchang calendar API
            return [];
        },
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });
}

export function usePlanetaryTransits(year: number, month: number) {
    return useQuery<PlanetaryTransit[]>({
        queryKey: ["calendar", "transits", year, month],
        queryFn: async () => {
            // TODO: Replace with actual transits API
            return [];
        },
        staleTime: 1000 * 60 * 60 * 24,
    });
}

export function useFestivals(year: number) {
    return useQuery<Festival[]>({
        queryKey: ["calendar", "festivals", year],
        queryFn: async () => {
            // TODO: Replace with actual festivals API
            return [];
        },
        staleTime: 1000 * 60 * 60 * 24 * 7, // 1 week
    });
}

export function usePersonalEvents(year: number, month: number) {
    return useQuery<PersonalEvent[]>({
        queryKey: ["calendar", "personal", year, month],
        queryFn: async () => {
            // TODO: Replace with actual personal events API
            return [];
        },
        staleTime: 1000 * 60 * 2,
    });
}

export function useCreateEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (event: Omit<PersonalEvent, "id">) => {
            // TODO: Replace with actual create event API
            return { ...event, id: crypto.randomUUID() } as PersonalEvent;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["calendar", "personal"] });
        },
    });
}

export function useDeleteEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (eventId: string) => {
            // TODO: Replace with actual delete event API
            return eventId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["calendar", "personal"] });
        },
    });
}
