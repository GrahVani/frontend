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
                <EmptyState
                    icon={Star}
                    title="No festival data available"
                    description="Festival data will populate once connected to the panchang API. Check back soon."
                />
            )}
        </div>
    );
}
