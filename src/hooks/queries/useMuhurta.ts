import { useQuery } from "@tanstack/react-query";
import type { MuhurtaCategory, MuhurtaResult, DailyMuhurta, MuhurtaFiltersState } from "@/types/muhurta.types";

function getTodayDateStr(): string {
    return new Date().toISOString().slice(0, 10);
}

export function useTodayMuhurta() {
    const today = getTodayDateStr();

    return useQuery<DailyMuhurta>({
        queryKey: ["muhurta", "daily", today],
        queryFn: async () => {
            // TODO: Replace with actual muhurta API call via astro-engine
            return {
                date: today,
                abhijitMuhurta: {
                    name: "Abhijit Muhurta",
                    startTime: "11:54 AM",
                    endTime: "12:42 PM",
                    quality: "excellent",
                    description: "The victorious muhurta — ideal for all auspicious activities.",
                },
                brahmaMuhurta: {
                    name: "Brahma Muhurta",
                    startTime: "04:48 AM",
                    endTime: "05:36 AM",
                    quality: "excellent",
                    description: "Sacred early morning window for spiritual practices.",
                },
                rahuKaal: {
                    name: "Rahu Kaal",
                    startTime: "07:30 AM",
                    endTime: "09:00 AM",
                    quality: "avoid",
                    description: "Inauspicious period governed by Rahu — avoid new beginnings.",
                },
                gulikaKaal: {
                    name: "Gulika Kaal",
                    startTime: "06:00 AM",
                    endTime: "07:30 AM",
                    quality: "avoid",
                    description: "Malefic period of Gulika — avoid important decisions.",
                },
                yamagandam: {
                    name: "Yamagandam",
                    startTime: "10:30 AM",
                    endTime: "12:00 PM",
                    quality: "avoid",
                    description: "Period ruled by Yama — avoid risky activities.",
                },
                generalWindows: [
                    {
                        name: "Morning Auspicious",
                        startTime: "09:00 AM",
                        endTime: "10:30 AM",
                        quality: "good",
                        description: "Good window after Rahu Kaal for general activities.",
                    },
                    {
                        name: "Afternoon Auspicious",
                        startTime: "02:00 PM",
                        endTime: "04:30 PM",
                        quality: "good",
                        description: "Favorable afternoon window for business and travel.",
                    },
                ],
            };
        },
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}

export function useMuhurtaSearch(filters: MuhurtaFiltersState | null) {
    return useQuery<MuhurtaResult[]>({
        queryKey: ["muhurta", "search", filters],
        queryFn: async () => {
            // TODO: Replace with actual API call
            return [];
        },
        enabled: !!filters,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useCategoryMuhurta(category: MuhurtaCategory, startDate?: string, endDate?: string) {
    return useQuery<MuhurtaResult[]>({
        queryKey: ["muhurta", category, startDate, endDate],
        queryFn: async () => {
            // TODO: Replace with actual category-specific muhurta API
            return [];
        },
        enabled: !!startDate && !!endDate,
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
}
