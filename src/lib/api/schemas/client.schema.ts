// Zod v4 schemas for client API responses

import { z } from 'zod';

export const clientSchema = z.object({
    id: z.string(),
    fullName: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional().nullable(),
    gender: z.string().optional().nullable(),
    birthDate: z.string().optional().nullable(),
    birthTime: z.string().optional().nullable(),
    birthPlace: z.string().optional().nullable(),
    placeOfBirth: z.string().optional().nullable(),
    dateOfBirth: z.string().optional().nullable(),
    timeOfBirth: z.string().optional().nullable(),
    phonePrimary: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    latitude: z.number().optional().nullable(),
    longitude: z.number().optional().nullable(),
    timezone: z.string().optional().nullable(),
    avatar: z.string().optional().nullable(),
    metadata: z.record(z.string(), z.unknown()).optional().nullable(),
    notes: z.array(z.record(z.string(), z.unknown())).optional().nullable(),
    consultations: z.array(z.record(z.string(), z.unknown())).optional().nullable(),
    familyLinksFrom: z.array(z.record(z.string(), z.unknown())).optional().nullable(),
    familyLinksTo: z.array(z.record(z.string(), z.unknown())).optional().nullable(),
    remedies: z.array(z.record(z.string(), z.unknown())).optional().nullable(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
}).catchall(z.unknown()); // Allow extra fields for forward compatibility

export const clientListSchema = z.object({
    clients: z.array(clientSchema),
    total: z.number(),
    page: z.number().optional(),
    limit: z.number().optional(),
    totalPages: z.number().optional(),
});

export type ValidatedClient = z.infer<typeof clientSchema>;
export type ValidatedClientList = z.infer<typeof clientListSchema>;
