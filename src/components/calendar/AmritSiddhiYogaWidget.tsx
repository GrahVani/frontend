"use client";

import { useAmritSiddhiYoga } from "@/hooks/queries/useCalendar";
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from "@/design-tokens/typography";
import { Sparkles, Calendar, Star, CheckCircle2 } from "lucide-react";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { motion } from "framer-motion";

interface AmritSiddhiYogaWidgetProps {
    year: number;
    className?: string;
}

export default function AmritSiddhiYogaWidget({ year, className }: AmritSiddhiYogaWidgetProps) {
    const { data, isLoading } = useAmritSiddhiYoga(year);

    if (isLoading) return <SkeletonCard className={className} />;
    
    // Handle nested data structure
    const yogaData = data?.data || data;
    const dates = yogaData?.dates || [];
    const totalCount = yogaData?.total_dates || dates.length;
    
    if (dates.length === 0) return null;
    
    // Get upcoming dates (from today onwards)
    const today = new Date();
    const upcomingDates = dates
        .filter((yoga: any) => new Date(yoga.date) >= today)
        .slice(0, 5);

    return (
        <div className={cn("prem-card p-4 relative overflow-hidden", className)}>
            {/* Decorative sparkles */}
            <div className="absolute top-2 right-2 opacity-15">
                <Sparkles className="w-16 h-16 text-gold-primary" />
            </div>
            
            <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400/20 to-yellow-500/15 border border-amber-400/25 flex items-center justify-center shrink-0">
                        <Star className="w-4 h-4 text-amber-600 fill-amber-500" />
                    </div>
                    <div>
                        <h3 className={cn(TYPOGRAPHY.sectionTitle)}>Amrit Siddhi Yoga</h3>
                        <p className="text-[11px] text-primary font-medium">Auspicious Timings</p>
                    </div>
                </div>

                <div className="space-y-2">
                    {upcomingDates.map((yoga: any, index: number) => {
                        const yogaDate = String(yoga.date || '');
                        const yogaNakshatra = String(yoga.nakshatra || '');
                        const yogaVara = String(yoga.vara || '');
                        const combination = String(yoga.combination || '');
                        
                        return (
                            <motion.div
                                key={`amrit-yoga-${yogaDate}-${index}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.08 }}
                                className="flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-r from-amber-500/5 to-yellow-500/5 border border-amber-500/20 hover:border-amber-500/40 transition-all"
                            >
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400/20 to-yellow-500/20 flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="w-5 h-5 text-amber-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                        <span className="text-[13px] font-medium text-primary truncate">
                                            {yogaDate ? new Date(yogaDate).toLocaleDateString("en-IN", {
                                                weekday: "short",
                                                month: "short",
                                                day: "numeric"
                                            }) : ''}
                                        </span>
                                    </div>
                                    {combination && (
                                        <p className="text-[11px] text-primary mt-0.5 truncate">
                                            {combination}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {upcomingDates.length === 0 && (
                    <div className="text-center py-4">
                        <p className="text-[12px] text-primary">No upcoming Amrit Siddhi Yoga dates</p>
                    </div>
                )}

                <div className="mt-3 pt-3 border-t border-surface-border/30">
                    <p className="text-[11px] text-primary text-center">
                        {totalCount} auspicious dates in {year}
                    </p>
                </div>
            </div>
        </div>
    );
}
