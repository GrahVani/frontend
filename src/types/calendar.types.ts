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
    name_hi?: string;
    date: string;
    date_end?: string;
    description: string;
    determination?: string;
    deity?: string;
    scope?: string;
    regions?: string[];
    regional_names?: string[];
    category: "MAJOR" | "EKADASHI" | "SANKRANTI" | "PURNIMA" | "AMAVASYA" | "PRADOSH" | "RECURRING" | "REGIONAL" | "VRAT" | string;
    is_government_holiday?: boolean;
    is_restricted_holiday?: boolean;
    sunrise?: string;
    sunset?: string;
    lunar_info?: {
        month_amanta: string;
        month_purnimanta: string;
        paksha: string;
        is_adhik_maas: boolean;
    };
    tithi_details?: {
       tithi: string;
       start_time?: string;
       end_time?: string;
    };
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
