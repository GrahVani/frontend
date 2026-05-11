import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { KnowledgeTooltip } from '@/components/knowledge';
import { getPlanetSymbol } from '@/lib/planet-symbols';
import { PLANET_SVG_FILLS } from '@/design-tokens/colors';

const SIGN_SYMBOLS: Record<string, string> = {
    'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
    'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
    'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓',
};

/** Element-based tint for sign symbols — subtle, doesn't compete with planet colors */
const SIGN_ELEMENT_COLORS: Record<string, string> = {
    'Aries': '#D97706', 'Leo': '#D97706', 'Sagittarius': '#D97706',       // Fire
    'Taurus': '#65A30D', 'Virgo': '#65A30D', 'Capricorn': '#65A30D',       // Earth
    'Gemini': '#7C3AED', 'Libra': '#7C3AED', 'Aquarius': '#7C3AED',       // Air
    'Cancer': '#0EA5E9', 'Scorpio': '#0EA5E9', 'Pisces': '#0EA5E9',       // Water
};

export interface PlanetaryInfo {
    planet: string;
    sign: string;
    degree: string;
    nakshatra: string;
    nakshatraPart?: number;
    house: number;
    isRetro?: boolean;
}

interface PlanetaryTableProps {
    planets: PlanetaryInfo[];
    className?: string;
    rowClassName?: string;
    variant?: 'compact' | 'expanded';
}

export default function PlanetaryTable({ planets, className, rowClassName, variant = 'compact' }: PlanetaryTableProps) {
    // Layout configurations based on variant
    const isExpanded = variant === 'expanded';

    // Width classes to ensure consistency between header and rows
    const colWidths = isExpanded ? {
        planet: "w-32",
        sign: "w-32",
        degree: "w-24",
        nakshatra: "w-40",
        pada: "w-16",
        house: "w-16",
        gap: "gap-x-6"
    } : {
        planet: "w-28",
        sign: "w-28",
        degree: "w-20",
        nakshatra: "w-30",
        pada: "w-14",
        house: "w-14",
        gap: "gap-x-3"
    };

    return (
        <div className={cn("w-full overflow-x-auto", className)} role="table" aria-label="Planetary positions table">
            {/* Header */}
            <div className={cn("flex py-1.5 px-3 border-b border-amber-200/50 min-w-max", colWidths.gap, TYPOGRAPHY.tableHeader)} role="row">
                <div className={cn(colWidths.planet, "shrink-0")} role="columnheader">Planet</div>
                <div className={cn(colWidths.sign, "shrink-0")} role="columnheader">Sign</div>
                <div className={cn(colWidths.degree, "shrink-0")} role="columnheader">Degree</div>
                <div className={cn(colWidths.nakshatra)} role="columnheader"><KnowledgeTooltip term="nakshatra">Nakshatra</KnowledgeTooltip></div>
                <div className={cn(colWidths.pada, "text-center shrink-0")} role="columnheader">Pada</div>
                <div className={cn(colWidths.house, "text-center shrink-0")} role="columnheader">House</div>
            </div>

            {/* Rows */}
            <div className="bg-transparent">
                {planets.map((p, i) => (
                    <div
                        key={p.planet}
                        className={cn(
                            "flex items-center px-3 font-sans text-[16px] border-b border-amber-200/40 last:border-0 hover:bg-amber-50 transition-colors leading-normal min-w-max",
                            colWidths.gap,
                            rowClassName || "py-1.5",
                            i % 2 === 0 ? "bg-transparent" : "bg-amber-50/50"
                        )}
                    >
                        {/* Planet Name */}
                        <div className={cn(colWidths.planet, "shrink-0 flex items-center gap-1.5 whitespace-nowrap", TYPOGRAPHY.planetName)} title={p.planet}>
                            <span
                                className="text-[18px] font-serif"
                                style={{ color: PLANET_SVG_FILLS[p.planet] || '#92400E' }}
                            >
                                {getPlanetSymbol(p.planet)}
                            </span>
                            <span>{p.planet}</span>
                            {p.isRetro && <span className="-ml-0.5 text-rose-600 text-[12px] font-medium">℞</span>}
                        </div>

                        {/* Sign */}
                        <div className={cn(colWidths.sign, "shrink-0 font-regular flex items-center gap-1.5 whitespace-nowrap", TYPOGRAPHY.planetName)} title={p.sign}>
                            <span
                                className="text-[16px] font-serif opacity-80"
                                style={{ color: SIGN_ELEMENT_COLORS[p.sign] || '#B45309' }}
                            >
                                {SIGN_SYMBOLS[p.sign] || ''}
                            </span>
                            <span>{p.sign}</span>
                        </div>

                        {/* Degree */}
                        <div className={cn(colWidths.degree, "shrink-0 font-regular", TYPOGRAPHY.dateAndDuration)}>
                            {p.degree}
                        </div>

                        {/* Nakshatra */}
                        <div className={cn(colWidths.nakshatra, "truncate font-regular", TYPOGRAPHY.planetName)} title={p.nakshatra}>
                            {p.nakshatra}
                        </div>

                        {/* Pada */}
                        <div className={cn(colWidths.pada, "text-center shrink-0", TYPOGRAPHY.value)}>
                            {p.nakshatraPart || '-'}
                        </div>

                        {/* House */}
                        <div className={cn(colWidths.house, "text-center shrink-0", TYPOGRAPHY.value)}>
                            {p.house}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

