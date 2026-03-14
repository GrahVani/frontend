"use client";

import { useNakshatraTransit } from "@/hooks/queries/useCalendar";
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from "@/design-tokens/typography";
import { Moon, Clock } from "lucide-react";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { motion } from "framer-motion";

interface NakshatraTransitWidgetProps {
    year: number;
    month: number;
    className?: string;
}

export default function NakshatraTransitWidget({ year, month, className }: NakshatraTransitWidgetProps) {
    const { data, isLoading } = useNakshatraTransit(year, month);

    if (isLoading) return <SkeletonCard className={className} />;
    
    // Handle nested data structure
    const transitData = data?.data || data;
    const transits = transitData?.transits || [];
    
    if (!transits || transits.length === 0) return null;
    
    // Get today's and upcoming transits
    const today = new Date();
    const upcomingTransits = transits
        .filter((t: any) => new Date(t.date) >= today)
        .slice(0, 7);

    return (
        <div className={cn("prem-card p-4", className)}>
            <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/15 to-blue-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                    <Moon className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                    <h3 className={cn(TYPOGRAPHY.sectionTitle)}>Nakshatra Transits</h3>
                    <p className="text-[11px] text-primary font-medium">Moon's Daily Journey</p>
                </div>
            </div>

            {/* Transit List */}
            <div className="space-y-1.5">
                {upcomingTransits.map((transit: any, index: number) => {
                    const transitDate = String(transit.date || '');
                    const nakshatraName = String(transit.nakshatra || '');
                    const pada = transit.pada;
                    const rashi = String(transit.rashi || '');
                    const nakshatraEntry = transit.nakshatra_entry;
                    
                    return (
                        <motion.div
                            key={`nakshatra-${transitDate}-${index}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center gap-3 p-2 rounded-lg bg-surface-base/30 border border-surface-border/30 hover:border-indigo-500/30 transition-all"
                        >
                            {/* Date */}
                            <div className="w-11 text-center shrink-0">
                                <span className="text-[10px] text-primary block">
                                    {transitDate ? new Date(transitDate).toLocaleDateString("en-IN", { weekday: "short" }) : ''}
                                </span>
                                <span className="text-[14px] font-bold text-primary">
                                    {transitDate ? new Date(transitDate).getDate() : ''}
                                </span>
                            </div>


                            {/* Nakshatra */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-[13px] font-medium text-indigo-700 truncate">
                                        {nakshatraName}
                                    </span>
                                    {pada && (
                                        <span className="text-[10px] px-1.5 py-0.5 bg-indigo-500/10 text-indigo-600 rounded-full shrink-0">
                                            P{pada}
                                        </span>
                                    )}
                                </div>
                                {rashi && (
                                    <p className="text-[10px] text-primary">
                                        {rashi}
                                    </p>
                                )}
                            </div>

                            {/* Entry Time */}
                            {nakshatraEntry && (
                                <div className="text-right shrink-0">
                                    <span className="text-[10px] text-primary flex items-center gap-0.5">
                                        <Clock className="w-3 h-3" />
                                        {String(nakshatraEntry).split('T')[1]?.split('+')[0]?.substring(0, 5) || ''}
                                    </span>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {upcomingTransits.length === 0 && (
                <div className="text-center py-4">
                    <p className="text-[12px] text-primary">No upcoming transits this month</p>
                </div>
            )}
        </div>
    );
}
