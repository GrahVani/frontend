"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import { TYPOGRAPHY } from "@/design-tokens/typography";
import type { PlanetaryTransit } from "@/types/calendar.types";

interface TransitTimelineProps {
    transits: PlanetaryTransit[];
    className?: string;
}

export default function TransitTimeline({ transits, className }: TransitTimelineProps) {
    return (
        <div className={cn("space-y-3", className)}>
            {transits.map((transit, i) => (
                <div
                    key={i}
                    className="bg-softwhite border border-antique rounded-xl p-4 hover:shadow-sm transition-shadow"
                >
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <h3 className={cn(TYPOGRAPHY.planetName)}>{transit.planet}</h3>
                            <Badge
                                variant={transit.significance === "major" ? "default" : "info"}
                                size="sm"
                            >
                                {transit.significance}
                            </Badge>
                        </div>
                        <span className={cn(TYPOGRAPHY.dateAndDuration)}>{transit.transitDate}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                        <span className={cn(TYPOGRAPHY.value, "bg-parchment/50 px-2 py-0.5 rounded")}>
                            {transit.fromSign}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gold-primary" />
                        <span className={cn(TYPOGRAPHY.value, "bg-gold-primary/10 px-2 py-0.5 rounded border border-gold-primary/20")}>
                            {transit.toSign}
                        </span>
                        <span className={cn(TYPOGRAPHY.subValue, "ml-auto")}>{transit.transitTime}</span>
                    </div>

                    <p className={cn(TYPOGRAPHY.subValue, "whitespace-normal")}>{transit.description}</p>
                </div>
            ))}
        </div>
    );
}
