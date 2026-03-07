"use client";

import { useState } from "react";
import { Moon } from "lucide-react";
import TransitTimeline from "@/components/calendar/TransitTimeline";
import EmptyState from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { usePlanetaryTransits } from "@/hooks/queries/useCalendar";

export default function TransitsPage() {
    const now = new Date();
    const [year] = useState(now.getFullYear());
    const [month] = useState(now.getMonth());

    const { data: transits, isLoading } = usePlanetaryTransits(year, month);

    const monthName = new Date(year, month).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
    });

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-header-gradient rounded-xl p-6 border border-header-border/30">
                <div className="flex items-center gap-2 mb-1">
                    <Moon className="w-5 h-5 text-active-glow" />
                    <h1 className="font-serif text-2xl font-bold text-softwhite">Planetary Transits</h1>
                </div>
                <p className="text-softwhite/80 font-serif italic text-sm max-w-2xl">
                    Track planetary movements and sign changes for {monthName}.
                </p>
            </div>

            {isLoading ? (
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : transits && transits.length > 0 ? (
                <div>
                    <h2 className="text-xs font-bold text-header-border tracking-widest font-serif uppercase mb-4">
                        {transits.length} Transit{transits.length !== 1 ? "s" : ""} This Month
                    </h2>
                    <TransitTimeline transits={transits} />
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="bg-gold-primary/10 border border-gold-primary/30 rounded-xl p-4 flex items-center gap-3">
                        <Moon className="w-5 h-5 text-gold-dark shrink-0" />
                        <p className="text-sm text-ink font-serif">
                            <span className="font-semibold">Coming Soon</span> — Planetary transit data will be available once connected to the astro engine API.
                        </p>
                    </div>
                    <EmptyState
                        icon={Moon}
                        title="No transits data yet"
                        description="Transit tracking for sign changes, retrogrades, and combustions is planned for an upcoming release."
                    />
                </div>
            )}
        </div>
    );
}
