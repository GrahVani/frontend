import { useQuery } from "@tanstack/react-query";

export interface PanchangData {
    date: string;
    tithi: string;
    nakshatra: string;
    yoga: string;
    karana: string;
    sunrise: string;
    sunset: string;
    rahuKaal: string;
    gulikaKaal: string;
    yamagandam: string;
    abhijitMuhurta: string;
}

function getTodayDateStr(): string {
    return new Date().toISOString().slice(0, 10);
}

export function usePanchang(date?: string) {
    const targetDate = date ?? getTodayDateStr();

    return useQuery<PanchangData>({
        queryKey: ["panchang", targetDate],
        queryFn: async () => {
            // TODO: Replace with actual panchang API call
            // The backend Grahvani astro-engine service will provide this
            return {
                date: targetDate,
                tithi: "Shukla Ekadashi",
                nakshatra: "Uttara Phalguni",
                yoga: "Siddha",
                karana: "Balava",
                sunrise: "06:32 AM",
                sunset: "06:18 PM",
                rahuKaal: "07:30 AM - 09:00 AM",
                gulikaKaal: "06:00 AM - 07:30 AM",
                yamagandam: "10:30 AM - 12:00 PM",
                abhijitMuhurta: "11:54 AM - 12:42 PM",
            };
        },
        staleTime: 1000 * 60 * 60 * 24, // 24 hours — panchang data is daily
    });
}

export function useMonthlyPanchang(year: number, month: number) {
    return useQuery<PanchangData[]>({
        queryKey: ["panchang", "monthly", year, month],
        queryFn: async () => {
            // TODO: Replace with actual monthly panchang API
            return [];
        },
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });
}
