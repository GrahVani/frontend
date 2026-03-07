"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import FestivalCard from "@/components/calendar/FestivalCard";
import EmptyState from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useFestivals } from "@/hooks/queries/useCalendar";

export default function FestivalsPage() {
    const [year] = useState(new Date().getFullYear());
    const { data: festivals, isLoading } = useFestivals(year);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-header-gradient rounded-xl p-6 border border-header-border/30">
                <div className="flex items-center gap-2 mb-1">
                    <Star className="w-5 h-5 text-active-glow" />
                    <h1 className="font-serif text-2xl font-bold text-softwhite">Festivals &amp; Events</h1>
                </div>
                <p className="text-softwhite/80 font-serif italic text-sm max-w-2xl">
                    Hindu festivals, Vedic observances, and auspicious days for {year}.
                </p>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : festivals && festivals.length > 0 ? (
                <div>
                    <h2 className="text-xs font-bold text-header-border tracking-widest font-serif uppercase mb-4">
                        {festivals.length} Festival{festivals.length !== 1 ? "s" : ""} This Year
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {festivals.map((festival) => (
                            <FestivalCard key={festival.id} festival={festival} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="bg-gold-primary/10 border border-gold-primary/30 rounded-xl p-4 flex items-center gap-3">
                        <Star className="w-5 h-5 text-gold-dark shrink-0" />
                        <p className="text-sm text-ink font-serif">
                            <span className="font-semibold">Coming Soon</span> — Festival data will populate once connected to the panchang API.
                        </p>
                    </div>
                    <EmptyState
                        icon={Star}
                        title="No festival data yet"
                        description="Hindu festivals, Vedic observances, and auspicious days will appear here in an upcoming release."
                    />
                </div>
            )}
        </div>
    );
}
