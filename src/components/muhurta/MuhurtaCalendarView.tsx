"use client";

import { cn } from "@/lib/utils";
import type { MuhurtaQuality } from "@/types/muhurta.types";

interface CalendarDay {
    date: number;
    quality?: MuhurtaQuality;
    label?: string;
    isCurrentMonth: boolean;
}

interface MuhurtaCalendarViewProps {
    year: number;
    month: number; // 0-indexed
    days: CalendarDay[];
    onDayClick?: (date: number) => void;
    className?: string;
}

const QUALITY_COLORS: Record<MuhurtaQuality, string> = {
    excellent: "bg-status-success/20 text-status-success border-status-success/40",
    good: "bg-gold-primary/15 text-gold-dark border-gold-primary/30",
    average: "bg-status-warning/15 text-status-warning border-status-warning/30",
    avoid: "bg-status-error/10 text-status-error border-status-error/30",
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function MuhurtaCalendarView({
    year,
    month,
    days,
    onDayClick,
    className,
}: MuhurtaCalendarViewProps) {
    const monthName = new Date(year, month).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
    });

    return (
        <div className={cn("prem-card p-5", className)}>
            <h3 className="text-[18px] font-serif font-bold text-ink mb-4 text-center">{monthName}</h3>

            <div className="grid grid-cols-7 gap-1">
                {WEEKDAYS.map((day) => (
                    <div key={day} className="text-center text-[12px] font-medium text-ink/45 py-2">
                        {day}
                    </div>
                ))}

                {days.map((day, i) => (
                    <button
                        key={i}
                        onClick={() => day.isCurrentMonth && day.date && onDayClick?.(day.date)}
                        disabled={!day.isCurrentMonth}
                        className={cn(
                            "aspect-square rounded-lg flex flex-col items-center justify-center text-[14px] font-serif border transition-all",
                            day.isCurrentMonth
                                ? day.quality
                                    ? QUALITY_COLORS[day.quality]
                                    : "bg-surface-warm/30 text-ink border-transparent hover:border-gold-primary/20"
                                : "text-ink/30 border-transparent cursor-default",
                            day.isCurrentMonth && onDayClick && "cursor-pointer hover:shadow-sm"
                        )}
                    >
                        <span className="font-semibold">{day.date || ""}</span>
                        {day.label && (
                            <span className="text-[9px] leading-tight truncate max-w-full px-0.5" title={day.label}>{day.label}</span>
                        )}
                    </button>
                ))}
            </div>

            <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-gold-primary/15">
                {(["excellent", "good", "average", "avoid"] as MuhurtaQuality[]).map((q) => (
                    <div key={q} className="flex items-center gap-1.5">
                        <div className={cn("w-3 h-3 rounded-sm border", QUALITY_COLORS[q])} />
                        <span className="text-[12px] text-ink/45 capitalize">{q}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
