/**
 * Dasha Utility Library — re-exports from modular split.
 * This file exists for backwards compatibility with existing imports.
 * All logic now lives in src/lib/dasha-utils/ (CA-003).
 */
export {
    // Types
    type DashaNode,
    type RawDashaPeriod,
    type DashaMetadata,
    type ActiveDashaPath,

    // Date helpers
    parseApiDate,
    formatDateDisplay,
    isDateRangeCurrent,
    formatDurationMs,
    calculateDuration,
    standardizeDuration,
    toApiDateString,

    // Period extraction
    getSignLord,
    getSublevels,
    resolvePlanetName,
    resolveStartDate,
    resolveEndDate,
    extractPeriodsArray,

    // Tree processing
    PLANET_ORDER,
    processDashaResponse,
    findActiveDashaPath,
    standardizeDashaLevels,
    generateVimshottariSubperiods,

    // Planet intel
    PLANET_INTEL,
} from './dasha-utils/index';
