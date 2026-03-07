"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PanchangDay } from "@/types/calendar.types";

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
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

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

    const handleDayClick = (dateNum: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dateNum).padStart(2, "0")}`;
        setSelectedDate(dateStr);
        const dayData = days.find((d) => d.date === dateStr);
        if (dayData && onDayClick) onDayClick(dayData);
    };

    return (
        <div className={cn("bg-softwhite border border-antique rounded-xl p-5", className)}>
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
                <button onClick={handlePrev} className="p-2.5 rounded-md hover:bg-parchment transition-colors" aria-label="Previous month">
                    <ChevronLeft className="w-5 h-5 text-ink" />
                </button>
                <h3 className="text-lg font-serif font-bold text-ink">{monthName}</h3>
                <button onClick={handleNext} className="p-2.5 rounded-md hover:bg-parchment transition-colors" aria-label="Next month">
                    <ChevronRight className="w-5 h-5 text-ink" />
                </button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
                {WEEKDAYS.map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-muted-refined py-2">
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
                    const isSelected = selectedDate === dateStr;
                    const isToday = dateStr === new Date().toISOString().slice(0, 10);
                    const hasFestival = dayData?.festivals && dayData.festivals.length > 0;

                    return (
                        <button
                            key={dateNum}
                            onClick={() => handleDayClick(dateNum)}
                            className={cn(
                                "aspect-square rounded-lg flex flex-col items-center justify-center text-sm font-serif border transition-all p-0.5",
                                isSelected
                                    ? "bg-gold-primary/20 border-gold-primary text-ink ring-1 ring-gold-primary"
                                    : isToday
                                        ? "bg-gold-primary/10 border-gold-primary/40 text-ink"
                                        : dayData?.isAuspicious
                                            ? "bg-status-success/10 border-status-success/20 text-ink"
                                            : "bg-parchment/20 border-transparent text-ink hover:border-antique",
                                "cursor-pointer hover:shadow-sm"
                            )}
                        >
                            <span className="font-semibold text-sm">{dateNum}</span>
                            {dayData && (
                                <span className="text-[8px] leading-tight text-muted-refined truncate max-w-full">
                                    {dayData.tithi.split(" ")[0]}
                                </span>
                            )}
                            {hasFestival && (
                                <div className="w-1.5 h-1.5 rounded-full bg-gold-primary mt-0.5" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Selected Day Detail */}
            {selectedDate && (() => {
                const dayData = days.find((d) => d.date === selectedDate);
                if (!dayData) return null;
                return (
                    <div className="mt-3 pt-3 border-t border-antique/50">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="bg-parchment/40 rounded-lg p-3">
                                <span className="text-xs text-muted-refined block">Tithi</span>
                                <span className="text-sm font-serif font-semibold text-ink">{dayData.tithi}</span>
                            </div>
                            <div className="bg-parchment/40 rounded-lg p-3">
                                <span className="text-xs text-muted-refined block">Nakshatra</span>
                                <span className="text-sm font-serif font-semibold text-ink">{dayData.nakshatra}</span>
                            </div>
                            <div className="bg-parchment/40 rounded-lg p-3">
                                <span className="text-xs text-muted-refined block">Yoga</span>
                                <span className="text-sm font-serif font-semibold text-ink">{dayData.yoga}</span>
                            </div>
                            <div className="bg-parchment/40 rounded-lg p-3">
                                <span className="text-xs text-muted-refined block">Karana</span>
                                <span className="text-sm font-serif font-semibold text-ink">{dayData.karana}</span>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}
