"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, Sparkles, Orbit } from "lucide-react";
import PanchangCalendar from "@/components/calendar/PanchangCalendar";
import CalendarDateDetails from "@/components/calendar/CalendarDateDetails";
import SamvatsaraWidget from "@/components/calendar/SamvatsaraWidget";
import RituWidget from "@/components/calendar/RituWidget";
import EclipsesWidget from "@/components/calendar/EclipsesWidget";
import VratCalendarWidget from "@/components/calendar/VratCalendarWidget";
import AmritSiddhiYogaWidget from "@/components/calendar/AmritSiddhiYogaWidget";
import PlanetaryTransitsWidget from "@/components/calendar/PlanetaryTransitsWidget";
import NakshatraTransitWidget from "@/components/calendar/NakshatraTransitWidget";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useMonthlyCalendar } from "@/hooks/queries/useCalendar";
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from "@/design-tokens/typography";

export default function CalendarPage() {
    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth() + 1); // 1-indexed month

    const [selectedDate, setSelectedDate] = useState(now.toISOString().split('T')[0]);

    const { data: days, isLoading } = useMonthlyCalendar(year, month - 1); // API uses 0-indexed

    return (
        <div className="space-y-5">
            {/* Header Area - Consistent with design system */}
            <div className="prem-card p-4 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-primary/15 to-gold-primary/5 border border-gold-primary/20 flex items-center justify-center shrink-0">
                    <CalendarIcon className="w-5 h-5 text-gold-dark" />
                </div>
                <div>
                    <h1 className={cn(TYPOGRAPHY.pageTitle, "font-serif")}>Panchang Calendar</h1>
                    <p className="text-[12px] text-primary font-medium">Vedic daily almanac & auspicious timings</p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">

                {/* Left Column - Calendar (8 cols) */}
                <div className="xl:col-span-8 space-y-4">
                    {isLoading ? (
                        <SkeletonCard />
                    ) : (
                        <PanchangCalendar
                            days={days || []}
                            year={year}
                            month={month - 1}
                            selectedDate={selectedDate}
                            onDayClick={(date) => setSelectedDate(date)}
                            onMonthChange={(y, m) => { setYear(y); setMonth(m + 1); }}
                        />
                    )}

                    {/* Celestial Events Header - Consistent styling */}
                    <div className="flex items-center gap-3 pt-2">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/10 flex items-center justify-center shrink-0">
                            <Orbit className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className={cn(TYPOGRAPHY.sectionTitle)}>Celestial Events</h3>
                            <p className="text-[11px] text-primary font-medium">Planetary movements and cosmic occurrences</p>
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-r from-indigo-500/20 to-transparent max-w-[200px] hidden md:block" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <PlanetaryTransitsWidget year={year} />
                        <EclipsesWidget year={year} />
                    </div>

                    {/* Quick Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SamvatsaraWidget year={year} />
                        <RituWidget year={year} />
                    </div>

                    {/* Guide Card - Improved styling */}
                    <div className="prem-card p-4 bg-gradient-to-r from-gold-primary/5 via-gold-primary/3 to-gold-primary/5 border-gold-primary/20">
                        <h3 className="text-[10px] font-bold text-gold-dark tracking-widest uppercase mb-3 flex items-center gap-2">
                            <Sparkles className="w-3 h-3" />
                            Panchanga Elements Guide
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px] text-primary">
                            <div className="space-y-2">
                                <p className="leading-relaxed"><span className="font-semibold text-gold-dark">Tithi:</span> <span className="text-primary/80">Lunar day based on Sun-Moon angular distance</span></p>
                                <p className="leading-relaxed"><span className="font-semibold text-gold-dark">Nakshatra:</span> <span className="text-primary/80">Lunar mansion the Moon occupies</span></p>
                            </div>
                            <div className="space-y-2">
                                <p className="leading-relaxed"><span className="font-semibold text-gold-dark">Yoga:</span> <span className="text-primary/80">Sun-Moon combined longitude classification</span></p>
                                <p className="leading-relaxed"><span className="font-semibold text-gold-dark">Karana:</span> <span className="text-primary/80">Half of a tithi, important for muhurta</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Widgets (4 cols) */}
                <div className="xl:col-span-4 space-y-4">

                    {/* Date Details Panel */}
                    <div className="bg-white border border-gold-primary/60 rounded-2xl p-4">
                        <CalendarDateDetails dateStr={selectedDate} />
                    </div>

                    {/* Auspicious Dates - Consistent header styling */}
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400/15 to-yellow-500/10 border border-amber-400/20 flex items-center justify-center shrink-0">
                            <Sparkles className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                            <h3 className={cn(TYPOGRAPHY.sectionTitle)}>Auspicious Times</h3>
                            <p className="text-[11px] text-primary font-medium">Favorable yoga periods</p>
                        </div>
                    </div>
                    <AmritSiddhiYogaWidget year={year} />

                    {/* Vrat Calendar */}
                    <VratCalendarWidget year={year} month={month} />

                    {/* Nakshatra Transit */}
                    <NakshatraTransitWidget year={year} month={month} />
                </div>
            </div>
        </div>
    );
}
