export type MuhurtaCategory = "wedding" | "property" | "vehicle" | "travel" | "general";

export type MuhurtaQuality = "excellent" | "good" | "average" | "avoid";

export interface MuhurtaTimeWindow {
    name: string;
    startTime: string;
    endTime: string;
    quality: MuhurtaQuality;
    description?: string;
}

export interface MuhurtaResult {
    id: string;
    date: string;
    dayOfWeek: string;
    tithi: string;
    nakshatra: string;
    yoga: string;
    quality: MuhurtaQuality;
    score: number; // 0-100
    bestTimeWindow: string;
    reasons: string[];
    warnings?: string[];
}

export interface MuhurtaFiltersState {
    startDate: string;
    endDate: string;
    location: string;
    category: MuhurtaCategory;
    latitude?: number;
    longitude?: number;
}

export interface DailyMuhurta {
    date: string;
    sunrise?: string;
    sunset?: string;
    abhijitMuhurta: MuhurtaTimeWindow;
    brahmaMuhurta: MuhurtaTimeWindow;
    rahuKaal: MuhurtaTimeWindow;
    gulikaKaal: MuhurtaTimeWindow;
    yamagandam: MuhurtaTimeWindow;
    generalWindows: MuhurtaTimeWindow[];
}
