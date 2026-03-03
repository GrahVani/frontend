export interface PanchangDay {
    date: string;
    tithi: string;
    nakshatra: string;
    yoga: string;
    karana: string;
    dayOfWeek: string;
    sunrise: string;
    sunset: string;
    isAuspicious: boolean;
    festivals?: string[];
}

export interface PlanetaryTransit {
    planet: string;
    fromSign: string;
    toSign: string;
    transitDate: string;
    transitTime: string;
    description: string;
    significance: "major" | "minor";
}

export interface Festival {
    id: string;
    name: string;
    date: string;
    description: string;
    significance: string;
    type: "hindu" | "vedic" | "regional";
}

export interface PersonalEvent {
    id: string;
    title: string;
    date: string;
    time?: string;
    description?: string;
    category: "consultation" | "follow_up" | "muhurta" | "personal" | "other";
    clientId?: string;
    clientName?: string;
}
