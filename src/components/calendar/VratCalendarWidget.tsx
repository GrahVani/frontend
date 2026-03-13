"use client";

import { useVratCalendar } from "@/hooks/queries/useCalendar";
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from "@/design-tokens/typography";
import { Utensils, Clock, ChevronRight } from "lucide-react";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { motion } from "framer-motion";
import Link from "next/link";

interface VratCalendarWidgetProps {
    year: number;
    month: number;
    className?: string;
}

const vratTypeColors: Record<string, string> = {
    "EKADASHI": "bg-blue-500/10 text-blue-600 border-blue-200",
    "PRADOSH": "bg-purple-500/10 text-purple-600 border-purple-200",
    "AMAVASYA": "bg-gray-500/10 text-gray-600 border-gray-200",
    "PURNIMA": "bg-amber-500/10 text-amber-600 border-amber-200",
    "SANKASHTI": "bg-red-500/10 text-red-600 border-red-200",
    "SASHTI": "bg-green-500/10 text-green-600 border-green-200",
    "VRAT": "bg-orange-500/10 text-orange-600 border-orange-200",
};

export default function VratCalendarWidget({ year, month, className }: VratCalendarWidgetProps) {
    const { data, isLoading } = useVratCalendar(year);

    if (isLoading) return <SkeletonCard className={className} />;
    if (!data?.data?.vrats && !data?.data?.by_month) return null;

    // Get vrats from by_month structure or flat vrats array
    let monthVrats: any[] = [];
    
    if (data.data.by_month) {
        // Get current month's vrats from by_month object
        const monthKey = `${year}-${String(month).padStart(2, '0')}`;
        monthVrats = data.data.by_month[monthKey] || [];
    } else if (data.data.vrats) {
        // Fallback to filtering flat vrats array
        monthVrats = data.data.vrats.filter((vrat: any) => {
            const vratDate = new Date(vrat.date);
            return vratDate.getMonth() === month - 1 && vratDate.getFullYear() === year;
        });
    }
    
    // Limit to 6 items
    monthVrats = monthVrats.slice(0, 6);

    if (monthVrats.length === 0) {
        return (
            <div className={cn("prem-card p-4", className)}>
                <div className="flex items-center gap-2 mb-3">
                    <Utensils className="w-4 h-4 text-gold-dark" />
                    <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-[14px]")}>Upcoming Vrats</h3>
                </div>
                <p className="text-[12px] text-primary text-center py-4">No major vrats this month</p>
            </div>
        );
    }

    return (
        <div className={cn("prem-card p-4", className)}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500/10 to-red-500/10 flex items-center justify-center">
                        <Utensils className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                        <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-[14px]")}>Vrat Calendar</h3>
                        <p className="text-[11px] text-primary">Fasting Days</p>
                    </div>
                </div>
                <Link 
                    href="/calendar/festivals" 
                    className="text-[11px] text-gold-dark hover:text-gold-primary flex items-center gap-0.5 transition-colors"
                >
                    View All <ChevronRight className="w-3 h-3" />
                </Link>
            </div>

            <div className="space-y-2">
                {monthVrats.map((vrat: any, index: number) => {
                    const vratDate = String(vrat.date || '');
                    const vratName = String(vrat.name || '');
                    const vratType = String(vrat.category || '');
                    const paranaTime = vrat.parana?.window_start || vrat.parana_time;
                    
                    return (
                        <motion.div
                            key={`vrat-${vratDate}-${index}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center gap-3 p-2.5 rounded-lg bg-surface-base/30 border border-surface-border/30 hover:border-gold-primary/30 transition-all group"
                        >
                            {/* Date Box */}
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gold-primary/10 to-gold-primary/5 flex flex-col items-center justify-center border border-gold-primary/20 shrink-0">
                                <span className="text-[10px] text-primary uppercase">
                                    {vratDate ? new Date(vratDate).toLocaleDateString("en-IN", { month: "short" }) : ''}
                                </span>
                                <span className="text-[16px] font-bold text-gold-dark leading-none">
                                    {vratDate ? new Date(vratDate).getDate() : ''}
                                </span>
                            </div>

                            {/* Vrat Info */}
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[13px] font-medium text-primary truncate group-hover:text-gold-dark transition-colors">
                                    {vratName}
                                </h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className={cn(
                                        "text-[10px] px-1.5 py-0.5 rounded border",
                                        vratTypeColors[vratType] || "bg-gold-primary/10 text-gold-dark border-gold-primary/20"
                                    )}>
                                        {vratType}
                                    </span>
                                    {paranaTime && (
                                        <span className="text-[10px] text-primary flex items-center gap-0.5">
                                            <Clock className="w-3 h-3" />
                                            Parana: {String(paranaTime)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
