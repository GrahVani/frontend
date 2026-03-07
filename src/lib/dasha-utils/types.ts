/**
 * Core Dasha type definitions shared across all dasha utilities.
 */

export interface DashaNode {
    planet: string;
    lord?: string;
    startDate: string;
    endDate: string;
    isCurrent?: boolean;
    canDrillFurther?: boolean;
    sublevel?: DashaNode[];
    raw?: Record<string, unknown>;
    duration?: string;
    type?: string;
    isBalance?: boolean;
    _calculated_start?: string;
}

/** Raw dasha period record from the Astro Engine — shape varies across 12+ dasha systems */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RawDashaPeriod = Record<string, any>;

export interface DashaMetadata {
    moonLongitude: number;
    nakshatraAtBirth: string;
    userName: string;
}

export interface ActiveDashaPath {
    nodes: DashaNode[];
    progress: number; // Percentage through current deepest period
    metadata?: DashaMetadata;
}
