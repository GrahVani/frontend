"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { PanchangDay } from "@/types/calendar.types";
import { useFestivalsByMonth } from "@/hooks/queries/useCalendar";

interface PanchangCalendarProps {
    days: PanchangDay[];
    year: number;
    month: number;
    onMonthChange: (year: number, month: number) => void;
    onDayClick?: (day: PanchangDay) => void;
    className?: string;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function PanchangCalendar({
    days,
    year,
    month,
    onMonthChange,
    onDayClick,
    className,
}: PanchangCalendarProps) {
    const router = useRouter();
    const { data: festivals = [] } = useFestivalsByMonth(year, month + 1);

    const monthName = new Date(year, month).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
    });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const handlePrev = () => {
        if (month === 0) onMonthChange(year - 1, 11);
        else onMonthChange(year, month - 1);
    };

    const handleNext = () => {
        if (month === 11) onMonthChange(year + 1, 0);
        else onMonthChange(year, month + 1);
    };

    const handleDayClick = (dateStr: string) => {
        router.push("/calendar/festivals/" + dateStr);
    };

    return (
        <div className={cn("prem-card p-5", className)}>
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
                <button onClick={handlePrev} className="p-2.5 rounded-md hover:bg-surface-warm transition-colors" aria-label="Previous month">
                    <ChevronLeft className="w-5 h-5 text-ink" />
                </button>
                <h3 className="text-[18px] font-serif font-bold text-ink">{monthName}</h3>
                <button onClick={handleNext} className="p-2.5 rounded-md hover:bg-surface-warm transition-colors" aria-label="Next month">
                    <ChevronRight className="w-5 h-5 text-ink" />
                </button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
                {WEEKDAYS.map((day) => (
                    <div key={day} className="text-center text-[12px] font-medium text-ink/45 py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for days before the first */}
                {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {/* Day cells */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const dateNum = i + 1;
                    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dateNum).padStart(2, "0")}`;
                    const dayData = days.find((d) => d.date === dateStr);
                    const isToday = dateStr === new Date().toISOString().slice(0, 10);
                    // Match the fetched live festivals with the current date
                    const dayFestivals = festivals.filter(f => f.date === dateStr);
                    const hasFestival = dayFestivals.length > 0;

                    return (
                        <button
                            key={dateNum}
                            onClick={() => handleDayClick(dateStr)}
                            className={cn(
                                "min-h-[100px] sm:min-h-[120px] rounded-lg flex flex-col items-start justify-start text-[14px] font-serif border transition-all p-2 relative group",
                                isToday
                                        ? "bg-gold-primary/5 border-gold-primary/30 text-ink"
                                        : dayData?.isAuspicious
                                            ? "bg-status-success/5 border-status-success/20 text-ink"
                                            : "bg-surface-warm/10 border-gold-primary/10 text-ink hover:border-gold-primary/30",
                                "cursor-pointer hover:shadow-sm"
                            )}
                        >
                            <div className="flex w-full justify-between items-start mb-1">
                                <span className={cn(
                                    "font-semibold text-[14px]", 
                                    isToday ? "bg-gold-primary text-white w-6 h-6 flex items-center justify-center rounded-full" : ""
                                )}>
                                    {dateNum}
                                </span>
                                <ChevronRight className="w-3 h-3 text-gold-dark/0 group-hover:text-gold-dark/50 transition-colors" />
                            </div>

                            {dayData && (
                                <span className="text-[10px] leading-tight text-ink/45 truncate max-w-full mb-1">
                                    {dayData.tithi.split(" ")[0]}
                                </span>
                            )}
                            
                            <div className="flex flex-col gap-1 w-full mt-auto">
                                {dayFestivals.slice(0, 2).map((f) => (
                                    <div 
                                        key={f.id} 
                                        className={cn(
                                            "text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded truncate w-full text-left font-sans font-medium",
                                            f.is_government_holiday 
                                                ? "bg-red-500/10 text-red-700" 
                                                : "bg-gold-primary/15 text-gold-dark"
                                        )}
                                        title={f.name}
                                    >
                                        {f.name}
                                    </div>
                                ))}
                                {dayFestivals.length > 2 && (
                                    <div className="text-[10px] text-ink/60 font-sans font-medium pl-1 text-left">
                                        +{dayFestivals.length - 2} more
                                    </div>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
