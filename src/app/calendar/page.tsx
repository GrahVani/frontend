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
            {/* Header */}
            <div className="prem-card glass-shimmer relative overflow-hidden p-5">
                <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                         style={{
                             background: 'linear-gradient(135deg, rgba(201,162,77,0.18) 0%, rgba(139,90,43,0.10) 100%)',
                             border: '1px solid rgba(201,162,77,0.25)',
                             boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(139,90,43,0.08)',
                         }}>
                        <CalendarIcon className="w-5 h-5 text-gold-dark" />
                    </div>
                    <div>
                        <h1 className="text-[18px] font-serif font-bold text-ink leading-tight">Panchang Calendar</h1>
                        <p className="text-[13px] text-ink/50 font-medium mt-0.5">
                            View daily tithi, nakshatra, yoga, and karana for each day
                        </p>
                    </div>
                </div>
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

            {/* Guide Card */}
            <div className="prem-card p-5">
                <h3 className="text-[11px] font-bold text-gold-dark tracking-widest font-serif uppercase mb-3">
                    How to Read the Calendar
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px] text-ink/55 font-medium">
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
