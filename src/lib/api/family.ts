// Family Link API endpoints

import { apiFetch, CLIENT_URL } from './core';
import type { FamilyLink, FamilyLinkPayload } from '@/types/client';

export const familyApi = {
    getFamilyLinks: (clientId: string): Promise<FamilyLink[]> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/family`),

    linkFamily: (clientId: string, data: FamilyLinkPayload): Promise<{ success: boolean }> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/family-link`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    unlinkFamily: (clientId: string, relatedClientId: string): Promise<{ success: boolean }> =>
        apiFetch(`${CLIENT_URL}/clients/${clientId}/family/${relatedClientId}`, {
            method: 'DELETE',
        }),
};
