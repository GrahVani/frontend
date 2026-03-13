"use client";

import { useMonthPanchangView } from "@/hooks/queries/useCalendar";
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from "@/design-tokens/typography";
import { CalendarDays, Sun, Moon, Star } from "lucide-react";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { motion } from "framer-motion";

interface MonthViewWidgetProps {
    year: number;
    month: number;
    className?: string;
}

export default function MonthViewWidget({ year, month, className }: MonthViewWidgetProps) {
    const { data, isLoading } = useMonthPanchangView(year, month);

    if (isLoading) return <SkeletonCard className={className} />;
    
    // Handle nested data structure
    const monthData = data?.data || data;
    const days = monthData?.days || [];
    
    if (!days || days.length === 0) return null;

    // Get today and upcoming days
    const today = new Date();
    const upcomingDays = days
        .filter((d: any) => new Date(d.date) >= today)
        .slice(0, 7);

    return (
        <div className={cn("prem-card p-4", className)}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-primary/10 to-amber-500/10 flex items-center justify-center">
                        <CalendarDays className="w-4 h-4 text-gold-dark" />
                    </div>
                    <div>
                        <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-[14px]")}>Month Overview</h3>
                        <p className="text-[11px] text-primary">Daily Panchang Summary</p>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                {upcomingDays.map((day: any, index: number) => {
                    const dayDate = String(day.date || '');
                    const dayOfWeek = String(day.day_of_week || '');
                    const tithi = String(day.tithi || '');
                    const nakshatra = String(day.nakshatra || '');
                    const yoga = String(day.yoga || '');
                    const sunrise = String(day.sunrise || '');
                    const sunset = String(day.sunset || '');
                    const festivals = day.festivals || [];
                    const hasFestival = festivals.length > 0;
                    
                    return (
                        <motion.div
                            key={`day-${dayDate}-${index}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={cn(
                                "p-2.5 rounded-lg border transition-all",
                                hasFestival 
                                    ? "bg-gold-primary/5 border-gold-primary/20" 
                                    : "bg-surface-base/30 border-surface-border/30 hover:border-gold-primary/20"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                {/* Date */}
                                <div className="w-12 text-center shrink-0">
                                    <span className="text-[10px] text-primary block">{dayOfWeek.slice(0, 3)}</span>
                                    <span className="text-[16px] font-bold text-primary">
                                        {dayDate ? new Date(dayDate).getDate() : ''}
                                    </span>
                                </div>

                                {/* Panchang Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-[11px] text-primary">{tithi}</span>
                                        <span className="text-[10px] text-primary">•</span>
                                        <span className="text-[11px] text-indigo-600">{nakshatra}</span>
                                        <span className="text-[10px] text-primary">•</span>
                                        <span className="text-[11px] text-primary">{yoga}</span>
                                    </div>
                                    
                                    {/* Sunrise/Sunset */}
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-[10px] text-primary flex items-center gap-0.5">
                                            <Sun className="w-3 h-3" />
                                            {sunrise.split(':').slice(0, 2).join(':')}
                                        </span>
                                        <span className="text-[10px] text-primary flex items-center gap-0.5">
                                            <Moon className="w-3 h-3" />
                                            {sunset.split(':').slice(0, 2).join(':')}
                                        </span>
                                    </div>
                                </div>

                                {/* Festival indicator */}
                                {hasFestival && (
                                    <div className="shrink-0">
                                        <Star className="w-4 h-4 text-gold-dark fill-gold-dark" />
                                    </div>
                                )}
                            </div>
                            
                            {/* Festival names */}
                            {hasFestival && (
                                <div className="mt-2 ml-15 pl-15 border-l-2 border-gold-primary/20">
                                    <p className="text-[10px] text-gold-dark truncate">
                                        {festivals.map((f: any) => f.name).join(', ')}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {upcomingDays.length === 0 && (
                <div className="text-center py-4">
                    <p className="text-[12px] text-primary">No upcoming days</p>
                </div>
            )}
        </div>
    );
}
