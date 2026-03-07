// Geocode API endpoints

import { apiFetch, CLIENT_URL } from './core';
import type { LocationSuggestion } from '@/types/client';

export const geocodeApi = {
    getSuggestions: (query: string, limit: number = 5): Promise<{ suggestions: LocationSuggestion[] }> =>
        apiFetch(`${CLIENT_URL}/geocode/suggest?q=${encodeURIComponent(query)}&limit=${limit}`),

    geocodePlace: (place: string): Promise<LocationSuggestion> =>
        apiFetch(`${CLIENT_URL}/geocode`, {
            method: 'POST',
            body: JSON.stringify({ place }),
        }),
};
