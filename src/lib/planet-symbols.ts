/**
 * Planet Symbols for Astrological Charts
 * Unicode symbols for planets used in Vedic astrology
 */

export const PLANET_SYMBOLS: Record<string, string> = {
    'Sun': '☉',
    'Su': '☉',
    'Moon': '☽',
    'Mo': '☽',
    'Mars': '♂',
    'Ma': '♂',
    'Mercury': '☿',
    'Me': '☿',
    'Jupiter': '♃',
    'Ju': '♃',
    'JuR': '♃',  // Jupiter Retrograde
    'Venus': '♀',
    'Ve': '♀',
    'Saturn': '♄',
    'Sa': '♄',
    'Rahu': '☊',
    'Ra': '☊',
    'Ketu': '☋',
    'Ke': '☋',
    'Ascendant': '☌',
    'As': '☌',
    'Asc': '☌',
    'Lagna': '☌',
    'Lg': '☌',
    'Uranus': '♅',
    'Ur': '♅',
    'Neptune': '♆',
    'Ne': '♆',
    'Pluto': '♇',
    'Pl': '♇',
};

/**
 * Get planet symbol by name
 */
export function getPlanetSymbol(name: string): string {
    return PLANET_SYMBOLS[name] || name.charAt(0);
}

/**
 * Format planet label based on display mode
 */
export function formatPlanetLabel(
    name: string,
    mode: 'name' | 'symbol' | 'both' = 'name'
): string {
    const symbol = getPlanetSymbol(name);

    switch (mode) {
        case 'symbol':
            return symbol;
        case 'both':
            return `${symbol} ${name}`;
        case 'name':
        default:
            return name;
    }
}

/**
 * Retrograde indicators
 */
export const RETROGRADE_STYLES: Record<string, string> = {
    'R': 'R',
    'R%': 'R%',
    'circle-R': 'Ⓡ',
};

export function getRetrogradeIndicator(style: string = 'R'): string {
    return RETROGRADE_STYLES[style] || 'R';
}

/**
 * Planet colors for chart display
 */
export const PLANET_COLORS: Record<string, string> = {
    'Sun': '#E76F00',
    'Su': '#E76F00',
    'Moon': '#6B8E9F',
    'Mo': '#6B8E9F',
    'Mars': '#C8413E',
    'Ma': '#C8413E',
    'Mercury': '#6B8E23',
    'Me': '#6B8E23',
    'Jupiter': '#DAA520',
    'Ju': '#DAA520',
    'JuR': '#DAA520',
    'Venus': '#C71585',
    'Ve': '#C71585',
    'Saturn': '#4169E1',
    'Sa': '#4169E1',
    'Rahu': '#4B0082',
    'Ra': '#4B0082',
    'Ketu': '#808080',
    'Ke': '#808080',
    'Ascendant': '#000000',
    'As': '#000000',
    'Asc': '#000000',
};
