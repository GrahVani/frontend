"use client";

import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import PanchangCalendar from "@/components/calendar/PanchangCalendar";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useMonthlyCalendar } from "@/hooks/queries/useCalendar";

export default function CalendarPage() {
    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth());

    const { data: days, isLoading } = useMonthlyCalendar(year, month);

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="bg-header-gradient rounded-xl p-6 border border-header-border/30">
                <div className="flex items-center gap-2 mb-1">
                    <CalendarIcon className="w-5 h-5 text-active-glow" />
                    <h1 className="font-serif text-2xl font-bold text-softwhite">Panchang Calendar</h1>
                </div>
                <p className="text-softwhite/80 font-serif italic text-sm max-w-2xl">
                    View daily Panchang details — tithi, nakshatra, yoga, and karana for each day.
                </p>
            </div>

            {isLoading ? (
                <SkeletonCard />
            ) : days && days.length > 0 ? (
                <PanchangCalendar
                    days={days}
                    year={year}
                    month={month}
                    onMonthChange={(y, m) => { setYear(y); setMonth(m); }}
                />
            ) : (
                <PanchangCalendar
                    days={[]}
                    year={year}
                    month={month}
                    onMonthChange={(y, m) => { setYear(y); setMonth(m); }}
                />
            )}

            <div className="bg-softwhite border border-antique rounded-xl p-5">
                <h3 className="text-xs font-bold text-header-border tracking-widest font-serif uppercase mb-3">
                    How to Read the Calendar
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-refined">
                    <div>
                        <p className="font-serif"><span className="font-semibold text-ink">Tithi:</span> Lunar day based on Sun-Moon angular distance</p>
                        <p className="font-serif mt-1"><span className="font-semibold text-ink">Nakshatra:</span> Lunar mansion the Moon occupies</p>
                    </div>
                    <div>
                        <p className="font-serif"><span className="font-semibold text-ink">Yoga:</span> Sun-Moon combined longitude classification</p>
                        <p className="font-serif mt-1"><span className="font-semibold text-ink">Karana:</span> Half of a tithi, important for muhurta</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
