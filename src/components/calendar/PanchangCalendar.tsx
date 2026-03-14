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
const WEEKDAY_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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
        <div className={cn("prem-card p-4", className)}>
            {/* Month Navigation - Enhanced */}
            <div className="flex items-center justify-between mb-4">
                <button 
                    onClick={handlePrev} 
                    className="p-2.5 rounded-xl hover:bg-gold-primary/10 border border-transparent hover:border-gold-primary/20 transition-all duration-200 group" 
                    aria-label="Previous month"
                >
                    <ChevronLeft className="w-5 h-5 text-primary group-hover:text-gold-dark transition-colors" />
                </button>
                <div className="text-center">
                    <h3 className="text-[18px] font-serif font-bold text-primary">{monthName}</h3>
                    <p className="text-[11px] text-primary mt-0.5">Vikram Samvat</p>
                </div>
                <button 
                    onClick={handleNext} 
                    className="p-2.5 rounded-xl hover:bg-gold-primary/10 border border-transparent hover:border-gold-primary/20 transition-all duration-200 group" 
                    aria-label="Next month"
                >
                    <ChevronRight className="w-5 h-5 text-primary group-hover:text-gold-dark transition-colors" />
                </button>
            </div>

            {/* Weekday Headers - Enhanced with visual distinction */}
            <div className="grid grid-cols-7 gap-2 mb-2">
                {WEEKDAYS.map((day, index) => (
                    <div 
                        key={day} 
                        className={cn(
                            "text-center text-[11px] font-semibold py-2.5 rounded-xl bg-white/50 border border-gold-primary/60",
                            index === 0 ? "text-red-600 bg-red-50/50 border-red-400" : "text-primary"
                        )}
                        title={WEEKDAY_FULL[index]}
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid - Enhanced spacing and visual feedback */}
            <div className="grid grid-cols-7 gap-2">
                {/* Empty cells for days before the first */}
                {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="min-h-[78px] sm:min-h-[90px] rounded-xl border border-gold-primary/60 bg-surface-base/30" />
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

                    const isSunday = new Date(year, month, dateNum).getDay() === 0;
                    
                    return (
                        <button
                            key={dateNum}
                            onClick={() => handleDayClick(dateStr)}
                            className={cn(
                                "min-h-[78px] sm:min-h-[90px] rounded-xl flex flex-col items-start justify-start text-[13px] font-serif transition-all duration-200 p-2.5 relative group",
                                isToday
                                    ? "bg-gold-primary/10 border-2 border-gold-dark/60 shadow-sm"
                                    : dateStr === selectedDate
                                        ? "bg-gold-primary/5 border-2 border-gold-dark/50 shadow-sm scale-[1.02] z-10"
                                        : dayData?.isAuspicious
                                            ? "bg-emerald-50/50 border border-emerald-500 hover:border-emerald-600"
                                            : isSunday
                                                ? "bg-red-50/30 border border-red-400 hover:border-red-500"
                                                : "bg-white border border-gold-primary/80 hover:border-gold-primary",
                                "cursor-pointer"
                            )}
                        >
                            <div className="flex w-full justify-between items-start mb-1.5">
                                <span className={cn(
                                    "font-bold text-[15px] w-7 h-7 flex items-center justify-center rounded-full transition-all",
                                    isToday 
                                        ? "bg-gold-primary text-white shadow-sm" 
                                        : dateStr === selectedDate
                                            ? "bg-gold-dark text-white shadow-sm"
                                            : isSunday
                                                ? "text-red-600"
                                                : "text-primary group-hover:bg-gold-primary/10"
                                )}>
                                    {dateNum}
                                </span>
                                <ChevronRight className={cn(
                                    "w-3.5 h-3.5 transition-all duration-200",
                                    dateStr === selectedDate || isToday ? "text-gold-dark" : "text-gold-dark/0 group-hover:text-gold-dark/70"
                                )} />
                            </div>

                            {dayData && (
                                <span className="text-[10px] leading-tight text-primary truncate max-w-full mb-1 font-semibold">
                                    {dayData.tithi.split(" ")[0]}
                                </span>
                            )}

                            <div className="flex flex-col gap-1 w-full mt-auto">
                                {dayFestivals.slice(0, 1).map((f) => (
                                    <div
                                        key={f.id}
                                        className={cn(
                                            "text-[9px] px-1.5 py-0.5 rounded truncate w-full text-left font-sans font-medium",
                                            f.is_government_holiday
                                                ? "bg-red-50 text-red-600"
                                                : "bg-amber-50 text-amber-700"
                                        )}
                                        title={f.name}
                                    >
                                        {f.name}
                                    </div>
                                ))}
                                {dayFestivals.length > 1 && (
                                    <div className="text-[9px] text-gold-dark font-sans font-semibold pl-0.5 text-left">
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
