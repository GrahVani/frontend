"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import FestivalCard from "@/components/calendar/FestivalCard";
import EmptyState from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { useFestivals, useFestivalCategories, FestivalFilterType } from "@/hooks/queries/useCalendar";
import UpcomingFestivalsWidget from "@/components/calendar/UpcomingFestivalsWidget";
import LunarMonthWidget from "@/components/calendar/LunarMonthWidget";

export default function FestivalsPage() {
    const [year] = useState(new Date().getFullYear());
    const [filter, setFilter] = useState<FestivalFilterType>('ALL');
    const { data: festivals, isLoading } = useFestivals(year, filter);
    const { data: dynamicCategories } = useFestivalCategories();

    // Map hardcoded essential tabs, then append dynamic ones if present
    const baseOptions = [
        { label: 'All Festivals', value: 'ALL' as FestivalFilterType },
        { label: 'Major', value: 'MAJOR' as FestivalFilterType },
        { label: 'Ekadashi', value: 'EKADASHI' as FestivalFilterType },
        { label: 'Sankranti', value: 'SANKRANTI' as FestivalFilterType },
        { label: 'Gov. Holidays', value: 'HOLIDAY' as FestivalFilterType },
        { label: 'Regional', value: 'REGIONAL' as FestivalFilterType },
    ];

    // Some categories from API might not be in our base list (like "VRATA", "JAYANTI", etc.)
    const filterOptions = [...baseOptions];
    if (dynamicCategories && dynamicCategories.length > 0) {
        dynamicCategories.forEach(cat => {
            if (!filterOptions.find(o => o.value === cat)) {
                // Formatting "VRATA" -> "Vrata", "JAYANTI" -> "Jayanti"
                const label = cat.charAt(0) + cat.slice(1).toLowerCase();
                filterOptions.push({ label, value: cat as FestivalFilterType });
            }
        });
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20">
            <div className="bg-header-gradient rounded-xl p-6 border border-gold-primary/20">
                <div className="flex items-center gap-2 mb-1">
                    <Star className="w-5 h-5 text-active-glow" />
                    <h1 className="font-serif text-[24px] font-bold text-softwhite">Festivals &amp; Events</h1>
                </div>
                <p className="text-softwhite/80 font-serif italic text-[14px] max-w-2xl">
                    Hindu festivals, Vedic observances, and auspicious days for {year}.
                </p>
            </div>

            {/* Main Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Festival Grid */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                        {filterOptions.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => setFilter(opt.value)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-[13px] font-medium transition-all whitespace-nowrap",
                                    filter === opt.value
                                        ? "bg-gold-primary text-white shadow-md shadow-gold-primary/20"
                                        : "bg-surface-warm/40 text-ink/70 hover:bg-gold-primary/10 hover:text-gold-dark"
                                )}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    ) : festivals && festivals.length > 0 ? (
                        <div>
                            <h2 className="text-[12px] font-bold text-gold-dark tracking-widest font-serif uppercase mb-4">
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
                            title="No festivals found"
                            description={`There are no festivals listed under the "${filter.toLowerCase()}" category for this period.`}
                        />
                    )}
                </div>

                {/* Right Column: Dynamic API Widgets */}
                <div className="space-y-6">
                    <UpcomingFestivalsWidget />
                    <LunarMonthWidget year={year} />
                </div>
            </div>
        </div>
    );
}
