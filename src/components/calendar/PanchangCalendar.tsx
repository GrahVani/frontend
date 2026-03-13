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
    onDayClick?: (date: string) => void;
    selectedDate?: string;
    className?: string;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function PanchangCalendar({
    days,
    year,
    month,
    onMonthChange,
    onDayClick,
    selectedDate,
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
        if (onDayClick) {
            onDayClick(dateStr);
        } else {
            router.push("/calendar/festivals/" + dateStr);
        }
    };

    return (
        <div className={cn("prem-card p-3 px-4", className)}>
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-2">
                <button onClick={handlePrev} className="p-2 rounded-md hover:bg-surface-warm transition-colors" aria-label="Previous month">
                    <ChevronLeft className="w-5 h-5 text-primary" />
                </button>
                <h3 className="text-[16px] font-serif font-bold text-primary">{monthName}</h3>
                <button onClick={handleNext} className="p-2 rounded-md hover:bg-surface-warm transition-colors" aria-label="Next month">
                    <ChevronRight className="w-5 h-5 text-primary" />
                </button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
                {WEEKDAYS.map((day) => (
                    <div key={day} className="text-center text-[12px] font-medium text-primary py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for days before the first */}
                {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="min-h-[78px] sm:min-h-[85px] rounded-lg border border-gold-primary/5 bg-surface-warm/5 opacity-40" />
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
                                "min-h-[78px] sm:min-h-[85px] rounded-lg flex flex-col items-start justify-start text-[13px] font-serif border transition-all p-1.5 relative group shadow-sm",
                                isToday
                                    ? "bg-gold-primary/10 border-gold-primary/50 text-primary ring-1 ring-gold-primary/20"
                                    : dateStr === selectedDate
                                        ? "bg-gold-primary/15 border-gold-primary/60 shadow-md ring-1 ring-gold-primary/30"
                                        : dayData?.isAuspicious
                                            ? "bg-status-success/5 border-status-success/40 text-primary"
                                            : "bg-white/50 border-gold-primary/30 text-primary hover:border-gold-primary/50 hover:bg-white/80",
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
                                <span className="text-[10px] leading-tight text-primary truncate max-w-full mb-1">
                                    {dayData.tithi.split(" ")[0]}
                                </span>
                            )}

                            <div className="flex flex-col gap-1 w-full mt-auto">
                                {dayFestivals.slice(0, 1).map((f) => (
                                    <div
                                        key={f.id}
                                        className={cn(
                                            "text-[9px] px-1 py-0.5 rounded truncate w-full text-left font-sans font-medium",
                                            f.is_government_holiday
                                                ? "bg-red-500/10 text-red-700"
                                                : "bg-gold-primary/15 text-gold-dark"
                                        )}
                                        title={f.name}
                                    >
                                        {f.name}
                                    </div>
                                ))}
                                {dayFestivals.length > 1 && (
                                    <div className="text-[8px] text-primary font-sans font-medium pl-1 text-left">
                                        +{dayFestivals.length - 1} more
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
