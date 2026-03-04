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
}

export default function PlanetaryTable({ planets, className }: PlanetaryTableProps) {
    return (
        <div className={cn("w-full", className)} role="table" aria-label="Planetary positions table">
            {/* Header */}
            <div className={cn("flex py-1.5 px-3 border-b border-border-warm", TYPOGRAPHY.tableHeader)} role="row">
                <div className="flex-1 min-w-[80px]" role="columnheader">Planet</div>
                <div className="flex-1 min-w-[80px]" role="columnheader">Sign</div>
                <div className="flex-1 min-w-[60px]" role="columnheader">Degree</div>
                <div className="flex-1 min-w-[100px]" role="columnheader">Nakshatra</div>
                <div className="w-[40px] text-center" role="columnheader">House</div>
            </div>

            {/* Rows */}
            <div className="bg-transparent">
                {planets.map((p, i) => (
                    <div
                        key={p.planet}
                        className={cn(
                            "flex items-center py-1 px-3 font-sans text-base border-b border-border-warm/30 last:border-0 hover:bg-gold-primary/5 transition-colors leading-normal",
                            i % 2 === 0 ? "bg-transparent" : "bg-antique/5"
                        )}
                    >
                        {/* Planet Name */}
                        <div className={cn("flex-1 min-w-[80px]", TYPOGRAPHY.planetName)}>
                            {p.planet}
                            {p.isRetro && <span className="ml-0.5 text-red-600 text-xs">(R)</span>}
                        </div>

                        {/* Sign */}
                        <div className={cn("flex-1 min-w-[80px] font-regular", TYPOGRAPHY.planetName)}>
                            {p.sign}
                        </div>

                        {/* Degree */}
                        <div className={cn("flex-1 min-w-[60px] font-regular", TYPOGRAPHY.dateAndDuration)}>
                            {p.degree}
                        </div>

                        {/* Nakshatra */}
                        <div className={cn("flex-1 min-w-[100px] font-regular", TYPOGRAPHY.planetName)}>
                            {p.nakshatra}
                            {p.nakshatraPart && <span className={cn("ml-1", TYPOGRAPHY.subValue)}>- {p.nakshatraPart}</span>}
                        </div>

                        {/* House */}
                        <div className={cn("w-[40px] text-center", TYPOGRAPHY.value)}>
                            {p.house}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

