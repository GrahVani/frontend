export interface BirthDetails {
    name: string;
    dateOfBirth: string;
    timeOfBirth: string;
    placeOfBirth: string;
    latitude?: number;
    longitude?: number;
    gender: "male" | "female";
}

export interface KootaScore {
    name: string;
    maxScore: number;
    obtainedScore: number;
    description: string;
}

export interface MatchResult {
    id: string;
    bride: BirthDetails;
    groom: BirthDetails;
    totalScore: number;
    maxScore: 36;
    kootas: KootaScore[];
    overallVerdict: "excellent" | "good" | "average" | "below_average";
    manglikStatus: {
        bride: boolean;
        groom: boolean;
        cancelled: boolean;
    };
    naadiDosha: boolean;
    bhakootDosha: boolean;
    recommendations: string[];
    createdAt: string;
}

export interface SavedMatch {
    id: string;
    result: MatchResult;
    notes?: string;
    savedAt: string;
}

// The 8 Ashta Koota categories
export const ASHTA_KOOTA_NAMES = [
    "Varna",
    "Vashya",
    "Tara",
    "Yoni",
    "Graha Maitri",
    "Gana",
    "Bhakoot",
    "Naadi",
] as const;

export const ASHTA_KOOTA_MAX_SCORES: Record<string, number> = {
    "Varna": 1,
    "Vashya": 2,
    "Tara": 3,
    "Yoni": 4,
    "Graha Maitri": 5,
    "Gana": 6,
    "Bhakoot": 7,
    "Naadi": 8,
};
