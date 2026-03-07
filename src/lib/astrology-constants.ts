/**
 * Re-exports planet and sign badge classes from the canonical design-tokens source.
 * Maintains backwards compatibility for existing dasha component imports.
 */
export { PLANET_BADGE_CLASSES as PLANET_COLORS } from '@/design-tokens/colors';

import { PLANET_BADGE_CLASSES } from '@/design-tokens/colors';

/**
 * Zodiac sign badge classes derived from their ruling planet colors.
 */
export const SIGN_COLORS: Record<string, string> = {
    Aries: PLANET_BADGE_CLASSES.Mars,
    Scorpio: PLANET_BADGE_CLASSES.Mars,
    Taurus: PLANET_BADGE_CLASSES.Venus,
    Libra: PLANET_BADGE_CLASSES.Venus,
    Gemini: PLANET_BADGE_CLASSES.Mercury,
    Virgo: PLANET_BADGE_CLASSES.Mercury,
    Cancer: PLANET_BADGE_CLASSES.Moon,
    Leo: PLANET_BADGE_CLASSES.Sun,
    Sagittarius: PLANET_BADGE_CLASSES.Jupiter,
    Pisces: PLANET_BADGE_CLASSES.Jupiter,
    Capricorn: PLANET_BADGE_CLASSES.Saturn,
    Aquarius: PLANET_BADGE_CLASSES.Saturn,
};
