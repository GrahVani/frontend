import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from '@/design-tokens/typography';

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
        nakshatra: "w-38",
        pada: "w-16",
        house: "w-16",
        gap: "gap-x-9"
    } : {
        planet: "w-20",
        sign: "w-20",
        degree: "w-18",
        nakshatra: "w-28",
        pada: "w-12",
        house: "w-12",
        gap: "gap-x-7"
    };

    return (
        <div className={cn("w-full", className)} role="table" aria-label="Planetary positions table">
            {/* Header */}
            <div className={cn("flex py-1.5 px-3 border-b border-border-warm", colWidths.gap, TYPOGRAPHY.tableHeader)} role="row">
                <div className={cn(colWidths.planet, "shrink-0")} role="columnheader">Planet</div>
                <div className={cn(colWidths.sign, "shrink-0")} role="columnheader">Sign</div>
                <div className={cn(colWidths.degree, "shrink-0")} role="columnheader">Degree</div>
                <div className={cn(colWidths.nakshatra)} role="columnheader">Nakshatra</div>
                <div className={cn(colWidths.pada, "text-center shrink-0")} role="columnheader">Pada</div>
                <div className={cn(colWidths.house, "text-center shrink-0")} role="columnheader">House</div>
            </div>

            {/* Rows */}
            <div className="bg-transparent">
                {planets.map((p, i) => (
                    <div
                        key={p.planet}
                        className={cn(
                            "flex items-center px-3 font-sans text-base border-b border-border-warm/30 last:border-0 hover:bg-gold-primary/5 transition-colors leading-normal",
                            colWidths.gap,
                            rowClassName || "py-1.5",
                            i % 2 === 0 ? "bg-transparent" : "bg-antique/5"
                        )}
                    >
                        {/* Planet Name */}
                        <div className={cn(colWidths.planet, "shrink-0 truncate", TYPOGRAPHY.planetName)} title={p.planet}>
                            {p.planet}
                            {p.isRetro && <span className="ml-0.5 text-red-600 text-xs">(R)</span>}
                        </div>

                        {/* Sign */}
                        <div className={cn(colWidths.sign, "shrink-0 truncate font-regular", TYPOGRAPHY.planetName)} title={p.sign}>
                            {p.sign}
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

