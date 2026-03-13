"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, Sparkles } from "lucide-react";
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
        <div className="space-y-4">
            {/* Header Area */}
            <div className="relative overflow-hidden p-3 px-4">
                <div className="flex items-center gap-3.5">

                    <div>
                        <h1 className="text-[18px] font-serif font-bold text-primary leading-tight">Panchang Calendar</h1>
                    </div>
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

                    {/* Celestial Events Header */}
                    <div className="flex items-center justify-between pt-2 px-1">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-[15px]")}>Celestial Events</h3>
                                <p className="text-[12px] text-primary/60">Planetary movements and cosmic occurrences</p>
                            </div>
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-r from-indigo-500/20 to-transparent ml-4 hidden sm:block" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <PlanetaryTransitsWidget year={year} />
                        <EclipsesWidget year={year} />
                    </div>

                    {/* Quick Stats Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <SamvatsaraWidget year={year} className="sm:col-span-2" />
                        <RituWidget year={year} className="sm:col-span-2" />
                    </div>

                    {/* Guide Card */}
                    <div className="prem-card p-3 px-4">
                        <h3 className="text-[10px] font-bold text-gold-dark tracking-widest font-serif uppercase mb-2 px-1">
                            Panchanga Elements Guide
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[12px] text-primary font-medium px-1">
                            <div className="space-y-1.5">
                                <p className="font-serif"><span className="font-semibold text-primary">Tithi:</span> Lunar day based on Sun-Moon angular distance</p>
                                <p className="font-serif"><span className="font-semibold text-primary">Nakshatra:</span> Lunar mansion the Moon occupies</p>
                            </div>
                            <div className="space-y-1.5">
                                <p className="font-serif"><span className="font-semibold text-primary">Yoga:</span> Sun-Moon combined longitude classification</p>
                                <p className="font-serif"><span className="font-semibold text-primary">Karana:</span> Half of a tithi, important for muhurta</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Widgets (4 cols) */}
                <div className="xl:col-span-4 space-y-4">

                    {/* Date Details Panel */}
                    <div className="prem-card p-4 shadow-lg border-gold-primary/20 bg-surface-base/50 backdrop-blur-md">
                        <CalendarDateDetails dateStr={selectedDate} />
                    </div>

                    {/* Auspicious Dates */}
                    <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-4 h-4 text-gold-dark" />
                        <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-[14px]")}>Auspicious Times</h3>
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
