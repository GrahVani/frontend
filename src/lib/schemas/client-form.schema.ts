// Zod v4 schema for client registration/edit form
// CA-009: Single source of truth for form validation + TypeScript types

import { z } from 'zod';

export const clientFormSchema = z.object({
    // Step 1: Personal Identity
    fullName: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
    gender: z.enum(['male', 'female', 'other'], { message: 'Please select a gender' }),
    maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed']).optional(),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    phonePrimary: z.string()
        .regex(/^[+]?[\d\s()-]{7,20}$/, 'Invalid phone number')
        .optional()
        .or(z.literal('')),
    phoneSecondary: z.string()
        .regex(/^[+]?[\d\s()-]{7,20}$/, 'Invalid phone number')
        .optional()
        .or(z.literal('')),

    // Step 2: Birth Details
    dateOfBirth: z.string()
        .min(1, 'Date of birth is required')
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD format')
        .refine((val) => {
            const d = new Date(val + 'T00:00:00');
            return !isNaN(d.getTime());
        }, 'Invalid date')
        .refine((val) => {
            const d = new Date(val + 'T00:00:00');
            return d <= new Date();
        }, 'Date of birth cannot be in the future')
        .refine((val) => {
            const d = new Date(val + 'T00:00:00');
            return d.getFullYear() >= 1900;
        }, 'Year must be 1900 or later'),
    timeOfBirth: z.string()
        .min(1, 'Time of birth is required')
        .regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Time must be HH:mm or HH:mm:ss'),
    birthTimeAccuracy: z.enum(['exact', 'approximate', 'rectified', 'unknown']),
    birthPlace: z.string().min(2, 'Birth place is required'),
    birthLatitude: z.number()
        .min(-90, 'Latitude must be between -90 and 90')
        .max(90, 'Latitude must be between -90 and 90')
        .optional(),
    birthLongitude: z.number()
        .min(-180, 'Longitude must be between -180 and 180')
        .max(180, 'Longitude must be between -180 and 180')
        .optional(),
    birthTimezone: z.string().optional().or(z.literal('')),

    // Step 3: Additional Info
    occupation: z.string().max(100, 'Occupation is too long').optional().or(z.literal('')),
    city: z.string().max(100).optional().or(z.literal('')),
    state: z.string().max(100).optional().or(z.literal('')),
    country: z.string().max(100).optional().or(z.literal('')),
    notes: z.string().max(5000, 'Notes too long (max 5000 chars)').optional().or(z.literal('')),
});

export type ClientFormData = z.infer<typeof clientFormSchema>;

// Fields belonging to each step — used by multi-step wizard for partial validation
export const STEP_FIELDS: Record<number, (keyof ClientFormData)[]> = {
    0: ['fullName', 'gender', 'maritalStatus', 'email', 'phonePrimary', 'phoneSecondary'],
    1: ['dateOfBirth', 'timeOfBirth', 'birthTimeAccuracy', 'birthPlace', 'birthLatitude', 'birthLongitude', 'birthTimezone'],
    2: ['occupation', 'city', 'state', 'country', 'notes'],
};

export const STEP_LABELS = ['Personal Identity', 'Birth Details', 'Additional Info'] as const;
