// Standardized stale times by data category (API-012)
// Different data types have different freshness requirements.

export const STALE_TIMES = {
    /** User profile, preferences — rarely changes */
    USER: 10 * 60 * 1000, // 10 minutes

    /** Client list — may update when others add clients */
    CLIENT_LIST: 2 * 60 * 1000, // 2 minutes

    /** Individual client detail — stable once loaded */
    CLIENT_DETAIL: 5 * 60 * 1000, // 5 minutes

    /** Chart calculations — immutable once computed */
    CHART: 60 * 60 * 1000, // 1 hour

    /** Dasha calculations — immutable, based on birth data */
    DASHA: 60 * 60 * 1000, // 1 hour

    /** KP calculations — immutable, based on birth data */
    KP: 60 * 60 * 1000, // 1 hour

    /** Ashtakavarga — immutable, based on birth data */
    ASHTAKAVARGA: 60 * 60 * 1000, // 1 hour

    /** Family links — rarely changes */
    FAMILY: 5 * 60 * 1000, // 5 minutes

    /** Location/geocode suggestions — can be cached longer */
    GEOCODE: 30 * 60 * 1000, // 30 minutes

    /** Calendar/panchang data — changes daily */
    CALENDAR: 15 * 60 * 1000, // 15 minutes

    /** Transits — time-sensitive, changes throughout the day */
    TRANSIT: 5 * 60 * 1000, // 5 minutes

    /** Matchmaking — immutable once computed, saved matches change rarely */
    MATCHMAKING: 60 * 60 * 1000, // 1 hour

    /** Saved matches list — user-driven changes */
    SAVED_MATCHES: 2 * 60 * 1000, // 2 minutes

    /** System capabilities — essentially static */
    CAPABILITIES: 24 * 60 * 60 * 1000, // 24 hours

    /** Numerology service — deterministic math + AI narrative varies */
    NUMEROLOGY: 60 * 60 * 1000, // 1 hour

    /** Numerology raw calculators — pure math, fully deterministic */
    NUMEROLOGY_RAW: 24 * 60 * 60 * 1000, // 24 hours
} as const;
