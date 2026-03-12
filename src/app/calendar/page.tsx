"use client";

import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import PanchangCalendar from "@/components/calendar/PanchangCalendar";
import CalendarDateDetails from "@/components/calendar/CalendarDateDetails";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useMonthlyCalendar } from "@/hooks/queries/useCalendar";

export default function CalendarPage() {
    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth());

    const [selectedDate, setSelectedDate] = useState(now.toISOString().split('T')[0]);

    const { data: days, isLoading } = useMonthlyCalendar(year, month);

    return (
        <div className="space-y-3">
            {/* Header Area */}
            <div className="prem-card glass-shimmer relative overflow-hidden p-3 px-4">
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
                        <h1 className="text-[18px] font-serif font-bold text-primary leading-tight">Panchang Calendar</h1>
                        <p className="text-[13px] text-primary font-medium mt-0.5">
                            Daily Vedic wisdom and celestial alignments
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 items-start">
                <div className="xl:col-span-3 space-y-4">
                    {isLoading ? (
                        <SkeletonCard />
                    ) : (
                        <PanchangCalendar
                            days={days || []}
                            year={year}
                            month={month}
                            selectedDate={selectedDate}
                            onDayClick={(date) => setSelectedDate(date)}
                            onMonthChange={(y, m) => { setYear(y); setMonth(m); }}
                        />
                    )}

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

                {/* Right Side Details Panel */}
                <div className="xl:col-span-1 xl:sticky xl:top-20">
                    <div className="prem-card p-4 h-fit shadow-lg border-gold-primary/20 bg-surface-base/50 backdrop-blur-md">
                        <CalendarDateDetails dateStr={selectedDate} />
                    </div>
                </div>
            </div>
        </div>
    );
}
