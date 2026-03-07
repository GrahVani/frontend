// Zod v4 schemas for chart API responses (BF-009)

import { z } from 'zod';

export const chartGenerateResponseSchema = z.object({
    success: z.boolean(),
    data: z.record(z.string(), z.unknown()),
    cached: z.boolean().optional(),
    calculatedAt: z.string().optional(),
}).catchall(z.unknown());

export const chartRecordSchema = z.object({
    id: z.string(),
    chartType: z.string(),
    ayanamsa: z.string().optional(),
    system: z.string().optional(),
    chartConfig: z.record(z.string(), z.unknown()).optional(),
    data: z.record(z.string(), z.unknown()).optional(),
}).catchall(z.unknown());

const dashaPeriodBaseSchema = z.object({
    planet: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    isCurrent: z.boolean().optional(),
    ageAtStart: z.number().optional(),
});

// For recursive types in zod v4, use a simple base schema.
// Deep sub-period validation can be added later if needed.
export const dashaPeriodSchema = dashaPeriodBaseSchema.extend({
    subPeriods: z.array(dashaPeriodBaseSchema).optional(),
});

export const dashaResponseSchema = z.object({
    clientId: z.string(),
    clientName: z.string(),
    level: z.string(),
    ayanamsa: z.string(),
    data: z.object({
        mahadashas: z.array(dashaPeriodSchema).optional(),
        current_dasha: dashaPeriodSchema.optional(),
    }),
    dasha_list: z.array(dashaPeriodSchema).optional(),
    cached: z.boolean(),
    calculatedAt: z.string(),
});

export const ashtakavargaResponseSchema = z.object({
    clientId: z.string(),
    clientName: z.string(),
    ayanamsa: z.string(),
    data: z.object({
        sarvashtakavarga: z.record(z.string(), z.array(z.number())).optional(),
        bhinnashtakavarga: z.record(z.string(), z.record(z.string(), z.array(z.number()))).optional(),
        total_points: z.number().optional(),
    }),
    cached: z.boolean(),
    calculatedAt: z.string(),
});

export type ValidatedChartGenerate = z.infer<typeof chartGenerateResponseSchema>;
export type ValidatedDasha = z.infer<typeof dashaResponseSchema>;
