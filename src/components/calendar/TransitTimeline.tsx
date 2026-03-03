"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
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
                            <h3 className="text-sm font-serif font-bold text-ink">{transit.planet}</h3>
                            <Badge
                                variant={transit.significance === "major" ? "default" : "info"}
                                size="sm"
                            >
                                {transit.significance}
                            </Badge>
                        </div>
                        <span className="text-xs text-muted-refined">{transit.transitDate}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-serif text-ink bg-parchment/50 px-2 py-0.5 rounded">
                            {transit.fromSign}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gold-primary" />
                        <span className="text-sm font-serif text-ink bg-gold-primary/10 px-2 py-0.5 rounded border border-gold-primary/20">
                            {transit.toSign}
                        </span>
                        <span className="text-xs text-muted-refined ml-auto">{transit.transitTime}</span>
                    </div>

                    <p className="text-xs text-muted-refined">{transit.description}</p>
                </div>
            ))}
        </div>
    );
}
