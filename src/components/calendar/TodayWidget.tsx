"use client";

import { useTodayData } from "@/hooks/queries/useCalendar";
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from "@/design-tokens/typography";
import { Sun, Moon, Star, Sparkles, ChevronRight, Calendar } from "lucide-react";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { motion } from "framer-motion";

interface TodayWidgetProps {
    dateStr: string;
    className?: string;
}

export default function TodayWidget({ dateStr, className }: TodayWidgetProps) {
    const { data, isLoading } = useTodayData(dateStr);

    if (isLoading) return <SkeletonCard className={className} />;
    
    // Handle nested data structure
    const todayData = data?.data || data;
    
    if (!todayData?.panchang) return null;

    const panchang = todayData.panchang;
    const festivals = todayData.festivals || [];
    const upcoming = todayData.upcoming || [];
    const yearInfo = todayData.year_info || {};

    return (
        <div className={cn("prem-card p-4", className)}>
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-primary/10 to-amber-500/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-gold-dark" />
                </div>
                <div>
                    <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-[14px]")}>Today</h3>
                    <p className="text-[11px] text-primary">
                        {yearInfo.samvatsara && `${yearInfo.samvatsara} • `}
                        VS {yearInfo.vikram_samvat}
                    </p>
                </div>
            </div>

            {/* Panchang Summary */}
            <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-gold-primary/5 to-amber-500/5 border border-gold-primary/20">
                <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                        <p className="text-[10px] text-primary uppercase tracking-wider">Tithi</p>
                        <p className="text-[14px] font-medium text-primary">{String(panchang.tithi || '-')}</p>
                        <p className="text-[10px] text-primary">{String(panchang.lunar_date || '')}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] text-primary uppercase tracking-wider">Nakshatra</p>
                        <p className="text-[14px] font-medium text-indigo-700">{String(panchang.nakshatra || '-')}</p>
                        <p className="text-[10px] text-primary">{String(panchang.moon_rashi || '')}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] text-primary uppercase tracking-wider">Yoga</p>
                        <p className="text-[14px] font-medium text-primary">{String(panchang.yoga || '-')}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] text-primary uppercase tracking-wider">Karana</p>
                        <p className="text-[14px] font-medium text-primary">{String(panchang.karana || '-')}</p>
                    </div>
                </div>
                
                {/* Sunrise/Sunset */}
                <div className="mt-3 pt-3 border-t border-gold-primary/10 flex justify-center gap-6">
                    <span className="text-[11px] text-primary flex items-center gap-1">
                        <Sun className="w-3.5 h-3.5 text-orange-500" />
                        Sunrise: {String(panchang.sunrise || '-').split(':').slice(0, 2).join(':')}
                    </span>
                    <span className="text-[11px] text-primary flex items-center gap-1">
                        <Moon className="w-3.5 h-3.5 text-indigo-500" />
                        Sunset: {String(panchang.sunset || '-').split(':').slice(0, 2).join(':')}
                    </span>
                </div>
            </div>

            {/* Today's Festivals */}
            {festivals.length > 0 && (
                <div className="mb-4">
                    <h4 className="text-[11px] font-medium text-primary uppercase tracking-wider mb-2">Today's Festivals</h4>
                    <div className="space-y-2">
                        {festivals.slice(0, 3).map((festival: any, index: number) => (
                            <motion.div
                                key={`today-festival-${index}`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-2 p-2 rounded-lg bg-gold-primary/5 border border-gold-primary/20"
                            >
                                <Star className="w-4 h-4 text-gold-dark fill-gold-dark shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-medium text-primary truncate">{String(festival.name || '')}</p>
                                    <p className="text-[10px] text-primary truncate">{String(festival.category || '')}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Upcoming Festivals */}
            {upcoming.length > 0 && (
                <div>
                    <h4 className="text-[11px] font-medium text-primary uppercase tracking-wider mb-2">Upcoming</h4>
                    <div className="space-y-1.5">
                        {upcoming.slice(0, 3).map((festival: any, index: number) => {
                            const festivalDate = String(festival.date || '');
                            return (
                                <motion.div
                                    key={`upcoming-${index}`}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center justify-between p-2 rounded-lg bg-surface-base/30 border border-surface-border/30"
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                                        <p className="text-[12px] text-primary truncate">{String(festival.name || '')}</p>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-primary shrink-0">
                                        {festivalDate ? new Date(festivalDate).toLocaleDateString("en-IN", {
                                            month: "short",
                                            day: "numeric"
                                        }) : ''}
                                        <ChevronRight className="w-3 h-3" />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
