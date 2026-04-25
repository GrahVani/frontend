/**
 * Dasha tree processing — maps raw API responses into standardized DashaNode trees.
 * Handles recursive traversal, date waterfall logic, and active path detection.
 */

import type { DashaNode, RawDashaPeriod, DashaMetadata, ActiveDashaPath } from './types';
import { parseApiDate, isDateRangeCurrent, toApiDateString } from './date-helpers';
import { extractPeriodsArray, getSublevels, resolvePlanetName, resolveStartDate, resolveEndDate } from './period-extraction';

// Vimshottari constants
const PLANET_ORDER = ['Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury', 'Ketu', 'Venus'];
const PLANET_YEARS: Record<string, number> = {
    'Sun': 6, 'Moon': 10, 'Mars': 7, 'Rahu': 18, 'Jupiter': 16,
    'Saturn': 19, 'Mercury': 17, 'Ketu': 7, 'Venus': 20
};
const VIMSHOTTARI_CYCLE_YEARS = 120;

export { PLANET_ORDER };

/** Recursive mapper to process a raw Dasha tree node */
function mapDashaLevelRecursive(node: RawDashaPeriod, level: number, inheritedStartDate?: string, maxLevel: number = 4): DashaNode {
    const rawChildren = getSublevels(node);
    let mappedChildren: DashaNode[] = [];

    let myStartDateRaw = resolveStartDate(node);
    if (!myStartDateRaw && inheritedStartDate) {
        myStartDateRaw = inheritedStartDate;
    }

    if (Array.isArray(rawChildren)) {
        let runningStart = myStartDateRaw;
        mappedChildren = rawChildren.map((child: RawDashaPeriod) => {
            const mappedChild = mapDashaLevelRecursive(child, level + 1, runningStart, maxLevel);
            runningStart = resolveEndDate(child);
            return mappedChild;
        });
    }

    const sDate = myStartDateRaw;
    const eDate = resolveEndDate(node);
    const isCurrent = isDateRangeCurrent(sDate, eDate);
    const hasChildren = mappedChildren.length > 0;

    return {
        planet: resolvePlanetName(node),
        startDate: sDate,
        endDate: eDate,
        isCurrent,
        canDrillFurther: level < maxLevel && hasChildren,
        sublevel: mappedChildren,
        raw: {
            ...node,
            duration_years: node.duration_years || (node.duration && typeof node.duration === 'number' ? node.duration : undefined) || (() => {
                const s = parseApiDate(sDate).getTime();
                const e = parseApiDate(eDate).getTime();
                return (!isNaN(s) && !isNaN(e) && e > s) ? (e - s) / (365.25 * 24 * 60 * 60 * 1000) : 0;
            })()
        }
    };
}

/** Detect how many levels deep the raw dasha data goes */
function detectDashaDepth(node: RawDashaPeriod, currentDepth: number = 0): number {
    if (!node) return currentDepth;
    const children = getSublevels(node);
    if (!Array.isArray(children) || children.length === 0) {
        return currentDepth;
    }
    // Find the deepest child
    let maxChildDepth = currentDepth + 1;
    for (const child of children) {
        const childDepth = detectDashaDepth(child, currentDepth + 1);
        if (childDepth > maxChildDepth) maxChildDepth = childDepth;
    }
    return maxChildDepth;
}

/** Auto-detect max level by scanning all periods for the deepest tree */
function autoDetectMaxLevel(data: RawDashaPeriod): number {
    const periods = extractPeriodsArray(data);
    if (periods.length === 0) return 4; // Default fallback
    // Scan all periods to find the maximum depth (first period may be a balance period with fewer levels)
    let maxDepth = 0;
    for (const period of periods) {
        const depth = detectDashaDepth(period, 0);
        if (depth > maxDepth) maxDepth = depth;
    }
    // depth 0 = no children → maxLevel 0 (just maha)
    // depth 1 = maha + antar → maxLevel 1
    // depth 2 = maha + antar + pratyantar → maxLevel 2
    // depth 3 = maha + antar + pratyantar + sookshma → maxLevel 3
    // depth 4 = maha + antar + pratyantar + sookshma + prana → maxLevel 4
    return maxDepth;
}

/** Process the full API response into a standardized Dasha tree */
export function processDashaResponse(data: RawDashaPeriod, maxLevel?: number): DashaNode[] {
    if (!data) return [];

    const periods = extractPeriodsArray(data);
    if (periods.length === 0) return [];

    // Auto-detect depth if maxLevel not provided
    const effectiveMaxLevel = maxLevel !== undefined ? maxLevel : autoDetectMaxLevel(data);

    let currentStart = '';

    if (periods.length > 0 && !periods[0].start_date) {
        const first = periods[0];
        const s = first.start_date || first.start;
        if (!s) {
            if (first.antardashas?.[0]?.start_date) currentStart = first.antardashas[0].start_date;
            else if (first.antardashas?.[0]?.start) currentStart = first.antardashas[0].start;
            else if (first.sublevels?.[0]?.start_date) currentStart = first.sublevels[0].start_date;
            else if (first.sublevels?.[0]?.start) currentStart = first.sublevels[0].start;
        } else {
            currentStart = s;
        }
    }

    return periods.map((m: RawDashaPeriod) => {
        const s = m.start_date || m.start;
        if (s) currentStart = s;
        const mapped = mapDashaLevelRecursive(m, 0, currentStart, effectiveMaxLevel);
        const e = m.end_date || m.end;
        if (e) currentStart = e;
        return mapped;
    });
}

/** Traverse a nested Dasha tree to find the current active path based on time */
export function findActiveDashaPath(rawResponse: RawDashaPeriod): ActiveDashaPath {
    const now = new Date();
    const path: DashaNode[] = [];

    const metadata: DashaMetadata = {
        moonLongitude: rawResponse.moon_longitude || 0,
        nakshatraAtBirth: rawResponse.nakshatra_at_birth || 'Unknown',
        userName: rawResponse.user_name || 'Anonymous'
    };

    const mahadashas = extractPeriodsArray(rawResponse);
    let currentLevel = mahadashas;
    let foundNode: RawDashaPeriod | null = null;
    let foundStart: string = "";
    let parentStart: string = "";

    while (currentLevel && Array.isArray(currentLevel) && currentLevel.length > 0) {
        let activeNode: RawDashaPeriod | null = null;
        let chainStart = parentStart;

        for (const p of currentLevel) {
            const s = resolveStartDate(p) || chainStart;
            const e = resolveEndDate(p);

            if (s && e) {
                const startTime = parseApiDate(s).getTime();
                const endTime = parseApiDate(e).getTime();
                const nowTime = now.getTime();

                if (nowTime >= startTime && nowTime < endTime) {
                    activeNode = p;
                    activeNode._calculated_start = s;
                    break;
                }
            }
            if (e) chainStart = e;
        }

        if (!activeNode) break;

        const sDate = activeNode._calculated_start;
        const eDate = resolveEndDate(activeNode);

        const standardizedNode: DashaNode = {
            planet: resolvePlanetName(activeNode),
            startDate: sDate,
            endDate: eDate,
            isCurrent: true,
            raw: activeNode
        };

        path.push(standardizedNode);
        foundNode = activeNode;
        foundStart = sDate;
        parentStart = sDate;
        currentLevel = getSublevels(activeNode) || [];
    }

    let progress = 0;
    if (foundNode) {
        const start = parseApiDate(foundNode._calculated_start || resolveStartDate(foundNode)).getTime();
        const end = parseApiDate(resolveEndDate(foundNode)).getTime();
        const nowMs = now.getTime();
        if (end > start) {
            progress = Math.max(0, Math.min(100, Math.round(((nowMs - start) / (end - start)) * 100)));
        }
    }

    return { nodes: path, progress, metadata };
}

/** Standardize a level of periods for the table view */
export function standardizeDashaLevels(periods: RawDashaPeriod[], parentStartDate?: string): DashaNode[] {
    if (periods.length > 0 && (periods[0].sublevel !== undefined || periods[0].canDrillFurther !== undefined)) {
        return periods as DashaNode[];
    }

    if (!Array.isArray(periods)) return [];

    const now = new Date();
    let currentChainStart = parentStartDate || "";

    return periods.map((p) => {
        const sDate = resolveStartDate(p) || currentChainStart;
        const eDate = resolveEndDate(p);

        if (eDate) currentChainStart = eDate;

        const sublevels = p.antardashas || p.pratyantardashas || p.pratyantara_dashas || p.sookshma_dashas || p.pran_dashas || p.sublevels;
        const canDrillFurther = Array.isArray(sublevels) && sublevels.length > 0;
        const isCurrent = sDate && eDate ? (now >= parseApiDate(sDate) && now <= parseApiDate(eDate)) : false;

        return {
            planet: resolvePlanetName(p),
            startDate: sDate,
            endDate: eDate,
            duration: '',
            isCurrent,
            canDrillFurther,
            sublevel: Array.isArray(sublevels) ? standardizeDashaLevels(sublevels, eDate) : [],
            raw: p
        };
    });
}

/** Generate sub-periods for a Vimshottari period on the fly (when API data is truncated) */
export function generateVimshottariSubperiods(parent: DashaNode): DashaNode[] {
    if (!parent || !parent.planet || !parent.startDate || !parent.endDate) return [];

    const cleanPlanet = parent.planet.split(' ')[0];
    const startIdx = PLANET_ORDER.indexOf(cleanPlanet);
    if (startIdx === -1) return [];

    const orderedPlanets = [...PLANET_ORDER.slice(startIdx), ...PLANET_ORDER.slice(0, startIdx)];

    const start = parseApiDate(parent.startDate);
    const end = parseApiDate(parent.endDate);
    const totalDurationMs = end.getTime() - start.getTime();

    let currentStart = start;

    return orderedPlanets.map(planet => {
        const proportion = (PLANET_YEARS[planet] || 0) / VIMSHOTTARI_CYCLE_YEARS;
        const durationMs = totalDurationMs * proportion;

        const periodStart = new Date(currentStart);
        const periodEnd = new Date(periodStart.getTime() + durationMs);
        currentStart = periodEnd;

        const sStr = toApiDateString(periodStart);
        const eStr = toApiDateString(periodEnd);

        return {
            planet,
            startDate: sStr,
            endDate: eStr,
            isCurrent: isDateRangeCurrent(sStr, eStr),
            canDrillFurther: true,
            sublevel: [],
            raw: { generated: true }
        };
    });
}
